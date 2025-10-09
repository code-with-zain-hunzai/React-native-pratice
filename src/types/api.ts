// API Response Types

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: Date | string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponse extends ApiResponse<AuthData> {
  success: true;
  message: string;
  data: AuthData;
}

export interface UserResponse extends ApiResponse<{ user: User }> {
  success: true;
  message: string;
  data: {
    user: User;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Request Types
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

