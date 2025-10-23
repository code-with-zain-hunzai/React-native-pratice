import { supabase } from '../config/supabase';
import { UserPresence, User } from '../types/api';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Presence Service
 * Handles tracking and displaying online/offline status of users
 */
class PresenceService {
  private presenceChannel: RealtimeChannel | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Set user status to online and start heartbeat
   */
  async setOnline(): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update or insert user presence with user information
      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          status: 'online',
          email: user.email || '',
          username: user.user_metadata?.full_name || 
                    user.user_metadata?.name || 
                    user.email?.split('@')[0] || 'User',
          full_name: user.user_metadata?.full_name || 
                     user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || 
                      user.user_metadata?.picture,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      // Start heartbeat to keep status updated
      this.startHeartbeat();
    } catch (error) {
      console.error('Set online error:', error);
      throw error;
    }
  }

  /**
   * Set user status to offline
   */
  async setOffline(): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return; // User not authenticated, nothing to do
      }

      // Stop heartbeat
      this.stopHeartbeat();

      // Update user presence to offline
      const { error } = await supabase
        .from('user_presence')
        .update({
          status: 'offline',
          last_seen: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Set offline error:', error);
      throw error;
    }
  }

  /**
   * Start heartbeat to keep user status updated
   * Updates presence every 30 seconds
   */
  private startHeartbeat(): void {
    // Clear existing interval if any
    this.stopHeartbeat();

    // Update presence every 30 seconds
    this.heartbeatInterval = setInterval(async () => {
      try {
        if (!supabase) return;

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          this.stopHeartbeat();
          return;
        }

        await supabase
          .from('user_presence')
          .update({
            status: 'online',
            last_seen: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Heartbeat error:', error);
      }
    }, 30000); // 30 seconds
  }

  /**
   * Stop heartbeat interval
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Get all online users
   * @returns Promise with array of online users with presence data
   */
  async getOnlineUsers(): Promise<UserPresence[]> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get all online users (excluding current user)
      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .eq('status', 'online')
        .neq('user_id', user.id);

      if (error) {
        throw error;
      }

      return (data || []) as UserPresence[];
    } catch (error) {
      console.error('Get online users error:', error);
      return [];
    }
  }

  /**
   * Get all users (online and offline)
   * @returns Promise with array of all users with presence data
   */
  async getAllUsers(): Promise<UserPresence[]> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get all users (excluding current user)
      // Sort by: 1) Online status first, 2) Most recently active
      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .neq('user_id', user.id)
        .order('last_seen', { ascending: false }); // Most recent first

      if (error) {
        throw error;
      }

      // Sort to show online users first, then by recent activity
      const sortedData = (data || []).sort((a: UserPresence, b: UserPresence) => {
        // Online users always come first
        if (a.status === 'online' && b.status !== 'online') return -1;
        if (a.status !== 'online' && b.status === 'online') return 1;
        
        // Within same status, sort by most recent activity
        const aTime = new Date(a.last_seen).getTime();
        const bTime = new Date(b.last_seen).getTime();
        return bTime - aTime;
      });

      return sortedData as UserPresence[];
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  }

  /**
   * Get user presence status
   * @param userId - ID of the user to check
   * @returns Promise with user presence data
   */
  async getUserPresence(userId: string): Promise<UserPresence | null> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, user presence not found
          return null;
        }
        throw error;
      }

      return data as UserPresence;
    } catch (error) {
      console.error('Get user presence error:', error);
      return null;
    }
  }

  /**
   * Subscribe to presence changes
   * @param callback - Function to call when presence changes
   * @returns Unsubscribe function
   */
  subscribeToPresence(callback: (presence: UserPresence) => void): () => void {
    try {
      if (!supabase) {
        console.warn('Supabase is not configured. Presence subscription disabled.');
        return () => {};
      }

      // Subscribe to all presence changes
      this.presenceChannel = supabase
        .channel('user_presence')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_presence',
          },
          (payload: any) => {
            console.log('Presence changed:', payload);
            if (payload.new) {
              callback(payload.new as UserPresence);
            }
          }
        )
        .subscribe();

      return () => {
        if (this.presenceChannel) {
          this.presenceChannel.unsubscribe();
          this.presenceChannel = null;
        }
      };
    } catch (error) {
      console.error('Subscribe to presence error:', error);
      return () => {};
    }
  }

  /**
   * Get online user count
   * @returns Promise with count of online users
   */
  async getOnlineUserCount(): Promise<number> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { count, error } = await supabase
        .from('user_presence')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'online');

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Get online user count error:', error);
      return 0;
    }
  }

  /**
   * Clean up presence service (stop heartbeat and set offline)
   */
  async cleanup(): Promise<void> {
    try {
      await this.setOffline();
      this.stopHeartbeat();
      
      if (this.presenceChannel) {
        this.presenceChannel.unsubscribe();
        this.presenceChannel = null;
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

// Export singleton instance
export default new PresenceService();

