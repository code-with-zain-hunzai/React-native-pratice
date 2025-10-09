import apiClient, { saveAuthToken, saveUserData, removeAuthToken } from '../api/api';
import { API_ENDPOINTS } from '../api/constant';
import {
  SignUpRequest,
  SignInRequest,
  AuthResponse,
  UserResponse,
  User,
} from '../types/api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
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
      return !!token;
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new AuthService();

