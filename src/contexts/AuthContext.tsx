import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import { User, SignUpRequest, SignInRequest } from '../types/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signUp: (data: SignUpRequest) => Promise<void>;
  signIn: (data: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  // OAuth methods
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  handleOAuthCallback: (url: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
        const userData = await authService.getUserData();
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

      const user = await authService.signUp(data);
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (data: SignInRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const user = await authService.signIn(data);
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please try again.');
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
    } catch (err: any) {
      setError(err.message || 'Sign out failed. Please try again.');
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
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to refresh user data.');
      
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

  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the new native Google Sign-In method
      const userData = await authService.signInWithGoogle();
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setError(err.message || 'Google sign in failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithFacebook = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.signInWithOAuth('facebook');
      // Note: The actual authentication happens via OAuth callback
      // The user will be set when handleOAuthCallback is called
    } catch (err: any) {
      setError(err.message || 'Facebook sign in failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOAuthCallback = useCallback(async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await authService.handleOAuthCallback(url);
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setError(err.message || 'OAuth authentication failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    clearError,
    refreshUser,
    signInWithGoogle,
    signInWithFacebook,
    handleOAuthCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


