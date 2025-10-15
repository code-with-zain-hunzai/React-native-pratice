import apiClient, { saveAuthToken, saveUserData, removeAuthToken } from '../api/api';
import { API_ENDPOINTS } from '../api/constant';
import {
  SignUpRequest,
  SignInRequest,
  AuthResponse,
  UserResponse,
  User,
} from '../types/api';
import { supabase } from '../config/supabase';
import { Provider } from '@supabase/supabase-js';
import { Linking } from 'react-native';
import { ENV } from '../config/env';

/**
 * Authentication Service
 * Handles all authentication-related API calls including:
 * - Traditional email/password auth (custom backend)
 * - Supabase OAuth (Google, Facebook)
 */
class AuthService {
  /**
   * Sign up a new user
   * @param data - User registration data (email, password, name)
   * @returns Promise with auth response containing user data and token
   */
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.SIGNUP,
        data
      );

      // Save token and user data to AsyncStorage
      if (response.data.success && response.data.data) {
        await saveAuthToken(response.data.data.token);
        await saveUserData(response.data.data.user);
      }

      return response.data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in an existing user
   * @param data - User login credentials (email, password)
   * @returns Promise with auth response containing user data and token
   */
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.SIGNIN,
        data
      );

      // Save token and user data to AsyncStorage
      if (response.data.success && response.data.data) {
        await saveAuthToken(response.data.data.token);
        await saveUserData(response.data.data.user);
      }

      return response.data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   * Requires valid JWT token in storage
   * @returns Promise with current user data
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<UserResponse>(API_ENDPOINTS.AUTH.ME);

      // Update user data in AsyncStorage
      if (response.data.success && response.data.data) {
        await saveUserData(response.data.data.user);
        return response.data.data.user;
      }

      throw new Error('Failed to get user data');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   * Removes token and user data from AsyncStorage
   */
  async signOut(): Promise<void> {
    try {
      await removeAuthToken();
      // You can also call a logout endpoint here if your backend has one
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns Promise<boolean> - true if token exists
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const { getAuthToken } = await import('../api/api');
      const token = await getAuthToken();
      
      // Also check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      return !!(token || session);
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }

  /**
   * Sign in with OAuth provider (Google or Facebook)
   * @param provider - OAuth provider ('google' | 'facebook')
   * @returns Promise with authentication result
   */
  async signInWithOAuth(provider: 'google' | 'facebook'): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: ENV.REDIRECT_URL,
          skipBrowserRedirect: false,
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
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      throw error;
    }
  }

  /**
   * Handle OAuth callback/deep link
   * This should be called when the app is opened via deep link after OAuth
   * @param url - The deep link URL
   */
  async handleOAuthCallback(url: string): Promise<User | null> {
    try {
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

        if (data?.session) {
          // Convert Supabase user to your User type
          const user: User = {
            id: Number(data.session.user.id) || 0,
            email: data.session.user.email || '',
            username: data.session.user.user_metadata?.full_name || 
                      data.session.user.user_metadata?.name || 
                      data.session.user.email?.split('@')[0] ||
                      'User',
            createdAt: data.session.user.created_at,
          };

          // Save user data
          await saveUserData(user);
          
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
  async getSupabaseSession() {
    try {
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
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  /**
   * Sign out from both custom backend and Supabase
   */
  async signOutAll(): Promise<void> {
    try {
      // Sign out from custom backend
      await this.signOut();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out all error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new AuthService();

