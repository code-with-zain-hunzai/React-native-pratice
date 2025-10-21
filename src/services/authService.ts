import { supabase } from '../config/supabase';
import { Provider } from '@supabase/supabase-js';
import { Linking } from 'react-native';
import { ENV } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SignUpRequest, SignInRequest, AuthSession } from '../types/api';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: '@user_data',
};

/**
 * Simple Supabase Authentication Service
 * Handles all authentication using Supabase Auth
 */
class AuthService {
  /**
   * Sign up a new user with email and password
   * @param data - User registration data (email, password, full_name)
   * @returns Promise with user data
   */
  async signUp(data: SignUpRequest): Promise<User> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name || '',
          },
        },
      });

      if (error) {
        throw error;
      }

      if (!authData.user) {
        throw new Error('No user data returned');
      }

      // Convert Supabase user to our User type
      const user: User = {
        id: authData.user.id,
        email: authData.user.email || '',
        full_name: authData.user.user_metadata?.full_name || '',
        username: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'User',
        avatar_url: authData.user.user_metadata?.avatar_url,
        created_at: authData.user.created_at,
      };

      // Save user data to AsyncStorage
      await this.saveUserData(user);

      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in an existing user with email and password
   * @param data - User login credentials (email, password)
   * @returns Promise with user data
   */
  async signIn(data: SignInRequest): Promise<User> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (!authData.user) {
        throw new Error('No user data returned');
      }

      // Convert Supabase user to our User type
      const user: User = {
        id: authData.user.id,
        email: authData.user.email || '',
        full_name: authData.user.user_metadata?.full_name || '',
        username: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'User',
        avatar_url: authData.user.user_metadata?.avatar_url,
        created_at: authData.user.created_at,
      };

      // Save user data to AsyncStorage
      await this.saveUserData(user);

      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   * @returns Promise with current user data or null
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!user) {
        return null;
      }

      // Convert Supabase user to our User type
      const userData: User = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at,
      };

      // Update user data in AsyncStorage
      await this.saveUserData(userData);

      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Clear stored user data
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns Promise<boolean> - true if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      if (!supabase) {
        return false;
      }

      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }

  /**
   * Sign in with OAuth provider (Google or Facebook)
   * @param provider - OAuth provider ('google' | 'facebook')
   */
  async signInWithOAuth(provider: 'google' | 'facebook'): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: ENV.REDIRECT_URL,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        throw error;
      }

      // Open the OAuth URL in browser
      if (data?.url) {
        const canOpen = await Linking.canOpenURL(data.url);
        if (canOpen) {
          await Linking.openURL(data.url);
        } else {
          throw new Error('Cannot open OAuth URL');
        }
      } else {
        throw new Error('No OAuth URL received');
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      throw error;
    }
  }

  /**
   * Sign in with Google using native Google Sign-In
   * This is the recommended approach for React Native apps
   * @returns Promise with user data
   */
  async signInWithGoogle(): Promise<User> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }

      // Configure Google Sign-In if not already configured
      await this.configureGoogleSignIn();

      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.data?.idToken) {
        throw new Error('No ID token received from Google');
      }

      // Sign in to Supabase with the Google ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.data.idToken,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned from Supabase');
      }

      // Convert Supabase user to our User type
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
        username: data.user.user_metadata?.full_name || 
                  data.user.user_metadata?.name || 
                  data.user.email?.split('@')[0] || 'User',
        avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
        created_at: data.user.created_at,
      };

      // Save user data
      await this.saveUserData(user);

      return user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  /**
   * Configure Google Sign-In
   * This should be called before using Google Sign-In
   */
  private async configureGoogleSignIn(): Promise<void> {
    try {
      // You'll need to add your Google Web Client ID here
      // Get this from your Google Cloud Console
      GoogleSignin.configure({
        webClientId: ENV.GOOGLE_WEB_CLIENT_ID || 'YOUR_GOOGLE_WEB_CLIENT_ID',
        offlineAccess: true,
      });
    } catch (error) {
      console.error('Google Sign-In configuration error:', error);
      throw new Error('Failed to configure Google Sign-In');
    }
  }

  /**
   * Handle OAuth callback/deep link
   * @param url - The deep link URL
   */
  async handleOAuthCallback(url: string): Promise<User | null> {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }

      // Parse the URL to extract tokens
      const hashIndex = url.indexOf('#');
      const queryString = hashIndex !== -1 ? url.substring(hashIndex + 1) : url.split('?')[1];
      
      if (!queryString) {
        throw new Error('No query parameters found in URL');
      }

      // Parse query parameters manually
      const params: Record<string, string> = {};
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[key] = decodeURIComponent(value);
        }
      });

      const accessToken = params['access_token'];
      const refreshToken = params['refresh_token'];

      if (accessToken && refreshToken) {
        // Set the session with the tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          throw error;
        }

        if (data?.session?.user) {
          // Convert Supabase user to our User type
          const user: User = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            full_name: data.session.user.user_metadata?.full_name || '',
            username: data.session.user.user_metadata?.full_name || 
                      data.session.user.email?.split('@')[0] || 'User',
            avatar_url: data.session.user.user_metadata?.avatar_url,
            created_at: data.session.user.created_at,
          };

          // Save user data
          await this.saveUserData(user);
          
          return user;
        }
      }

      return null;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  /**
   * Get current Supabase session
   * @returns Current session or null
   */
  async getSession() {
    try {
      if (!supabase) {
        return null;
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Listen to auth state changes
   * @param callback - Function to call when auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) {
      console.warn('Supabase is not configured. Auth state changes will not be tracked.');
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange((event: string, session: any) => {
      callback(event, session);
    });
  }

  /**
   * Save user data to AsyncStorage
   * @param userData - User data to save
   */
  private async saveUserData(userData: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  /**
   * Get user data from AsyncStorage
   * @returns User data or null
   */
  async getUserData(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
}

// Export singleton instance
export default new AuthService();