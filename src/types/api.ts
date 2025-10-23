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

// Chat Types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  user: User;
  lastMessage?: Message;
  unreadCount: number;
}

export interface UserPresence {
  user_id: string;
  status: 'online' | 'offline';
  email?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  last_seen: string;
  updated_at?: string;
  user?: User;
}

