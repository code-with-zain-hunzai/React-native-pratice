import { useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';
import { User, SignUpRequest, SignInRequest } from '../types/api';
import { ApiError } from '../api/api';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signUp: (data: SignUpRequest) => Promise<void>;
  signIn: (data: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * Custom hook for authentication
 * Provides authentication state and methods
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        // Try to get current user data
        const { getUserData } = await import('../api/api');
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        }
      }
    } catch (err) {
      console.error('Check auth error:', err);
      setIsAuthenticated(false);
    }
  };

  const signUp = useCallback(async (data: SignUpRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.signUp(data);
      
      if (response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Sign up failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (data: SignInRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.signIn(data);
      
      if (response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Sign in failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.signOut();
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Sign out failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to refresh user data.');
      
      // If refresh fails, user might not be authenticated
      setIsAuthenticated(false);
      setUser(null);
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    clearError,
    refreshUser,
  };
};

