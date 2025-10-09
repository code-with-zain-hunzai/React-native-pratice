import { Platform } from 'react-native';

// API Configuration Constants

// Base URL for the backend API
// For local development:
// - Android Emulator: use 10.0.2.2:3000
// - iOS Simulator: use localhost:3000
// - Physical Device: use your computer's IP address (e.g., 192.168.x.x:3000)
//   To find your IP: run `npm run get-ip` in the KekarApp directory

// IMPORTANT: For physical devices, replace the Platform.select with your actual IP
export const API_BASE_URL = __DEV__
  ? Platform.select({
      android: 'http://10.0.2.2:3000/api',      // Android Emulator
      ios: 'http://localhost:3000/api',          // iOS Simulator
      // For physical devices, uncomment and use your IP:
      // default: 'http://YOUR_IP:3000/api'
    }) as string
  : 'https://your-production-api.com/api'; // Production URL

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    ME: '/auth/me',
  },
  // Add more endpoints here as your app grows
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
};

// Request Timeout (in milliseconds)
export const REQUEST_TIMEOUT = 30000; // 30 seconds

