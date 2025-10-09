import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS, REQUEST_TIMEOUT } from './constant';

// Custom error type for better error handling
export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
  errors?: any;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (token && config.headers) {
        // Add authorization header with Bearer token
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development mode
      if (__DEV__) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          headers: config.headers,
          data: config.data,
        });
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development mode
    if (__DEV__) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    // Log error in development mode
    if (__DEV__) {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        success: false,
        message: (error.response.data as any)?.message || 'An error occurred',
        statusCode: error.response.status,
        errors: (error.response.data as any)?.errors,
      };

      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response.status === 401) {
        // Clear stored token and user data
        await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
        
        // You can add navigation to login screen here if needed
        // Example: navigationRef.navigate('SignIn');
        
        apiError.message = 'Session expired. Please login again.';
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        apiError.message = 'You do not have permission to perform this action.';
      }

      // Handle 404 Not Found
      if (error.response.status === 404) {
        apiError.message = 'Resource not found.';
      }

      // Handle 500 Internal Server Error
      if (error.response.status === 500) {
        apiError.message = 'Server error. Please try again later.';
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      // Request was made but no response received
      const apiError: ApiError = {
        success: false,
        message: 'Cannot connect to server. Please check your internet connection.',
      };
      return Promise.reject(apiError);
    } else {
      // Something else happened
      const apiError: ApiError = {
        success: false,
        message: error.message || 'An unexpected error occurred.',
      };
      return Promise.reject(apiError);
    }
  }
);

// Helper function to save auth token
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw error;
  }
};

// Helper function to get auth token
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to remove auth token
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
  } catch (error) {
    console.error('Error removing auth token:', error);
    throw error;
  }
};

// Helper function to save user data
export const saveUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

// Helper function to get user data
export const getUserData = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export default apiClient;

