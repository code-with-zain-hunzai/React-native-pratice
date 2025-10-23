import { supabase } from '../config/supabase';
import { Message, User, Conversation } from '../types/api';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Chat Service
 * Handles all chat-related operations including sending messages,
 * fetching conversations, and real-time message subscriptions
 */
class ChatService {
  private messageChannel: RealtimeChannel | null = null;

  /**
   * Send a message to another user
   * @param receiverId - ID of the user receiving the message
   * @param content - Message content
   * @returns Promise with the sent message
   */
  async sendMessage(receiverId: string, content: string): Promise<Message> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim(),
          read: false,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Message;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * Get all messages in a conversation with a specific user
   * @param userId - ID of the other user in the conversation
   * @returns Promise with array of messages
   */
  async getConversation(userId: string): Promise<Message[]> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []) as Message[];
    } catch (error) {
      console.error('Get conversation error:', error);
      throw error;
    }
  }

  /**
   * Get all conversations (unique users the current user has chatted with)
   * @returns Promise with array of conversations
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get all messages involving the current user
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) {
        throw messagesError;
      }

      if (!messages || messages.length === 0) {
        return [];
      }

      // Group messages by conversation partner
      const conversationMap = new Map<string, {
        userId: string;
        lastMessage: Message;
        unreadCount: number;
      }>();

      for (const message of messages) {
        const partnerId = message.sender_id === user.id 
          ? message.receiver_id 
          : message.sender_id;

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            userId: partnerId,
            lastMessage: message as Message,
            unreadCount: 0,
          });
        }

        // Count unread messages (messages sent to current user that are unread)
        if (message.receiver_id === user.id && !message.read) {
          const conv = conversationMap.get(partnerId)!;
          conv.unreadCount++;
        }
      }

      // Get user details for all conversation partners
      const userIds = Array.from(conversationMap.keys());
      const { data: users, error: usersError } = await supabase
        .from('auth.users')
        .select('id, email, raw_user_meta_data')
        .in('id', userIds);

      // If we can't fetch from auth.users directly, we'll create placeholder users
      const conversations: Conversation[] = [];
      
      for (const [userId, conv] of conversationMap) {
        // Try to get user info from message metadata or create a basic user object
        const userInfo: User = {
          id: userId,
          email: 'user@example.com', // Placeholder
          username: 'User',
          full_name: 'User',
          created_at: new Date().toISOString(),
        };

        conversations.push({
          user: userInfo,
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount,
        });
      }

      return conversations;
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   * @param messageIds - Array of message IDs to mark as read
   */
  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .in('id', messageIds);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Mark messages as read error:', error);
      throw error;
    }
  }

  /**
   * Mark all messages from a specific user as read
   * @param senderId - ID of the user who sent the messages
   */
  async markConversationAsRead(senderId: string): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id)
        .eq('read', false);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Mark conversation as read error:', error);
      throw error;
    }
  }

  /**
   * Subscribe to new messages for the current user
   * @param callback - Function to call when a new message is received
   * @returns Unsubscribe function
   */
  subscribeToMessages(callback: (message: Message) => void): () => void {
    try {
      if (!supabase) {
        console.warn('Supabase is not configured. Message subscription disabled.');
        return () => {};
      }

      // Get current user ID synchronously from auth state
      const getCurrentUserId = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id;
      };

      getCurrentUserId().then(userId => {
        if (!userId) {
          console.warn('User not authenticated. Message subscription disabled.');
          return;
        }

        // Subscribe to new messages where current user is the receiver
        this.messageChannel = supabase
          .channel('messages')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `receiver_id=eq.${userId}`,
            },
            (payload) => {
              console.log('New message received:', payload);
              callback(payload.new as Message);
            }
          )
          .subscribe();
      });

      return () => {
        if (this.messageChannel) {
          this.messageChannel.unsubscribe();
          this.messageChannel = null;
        }
      };
    } catch (error) {
      console.error('Subscribe to messages error:', error);
      return () => {};
    }
  }

  /**
   * Get unread message count
   * @returns Promise with unread message count
   */
  async getUnreadCount(): Promise<number> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  /**
   * Delete a message
   * @param messageId - ID of the message to delete
   */
  async deleteMessage(messageId: string): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured');
      }

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new ChatService();

