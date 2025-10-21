import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV, validateEnv } from './env';

// Validate environment configuration
const isConfigValid = validateEnv();

// Create Supabase client with fallback for development
let supabase: any = null;

if (isConfigValid) {
  try {
    supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    supabase = null;
  }
} else {
  console.warn('Supabase client not initialized due to missing configuration');
}

export { supabase };

