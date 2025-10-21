// Supabase User Types

export interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

// Request Types
export interface SignUpRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

