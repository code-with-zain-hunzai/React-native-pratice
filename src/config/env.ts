
export const ENV = {
  SUPABASE_URL: 'YOUR_SUPABASE_URL', // e.g., 'https://xxxxx.supabase.co'
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY', // Your Supabase anon/public key
  
  // OAuth Redirect URLs
  // These should match your app's deep link scheme
  REDIRECT_URL: 'kekarapp://auth/callback',
  
  // Backend API (if you still want to use your custom backend alongside Supabase)
  API_BASE_URL: 'http://localhost:3000',
};

/**
 * Validation function to check if environment is properly configured
 */
export const validateEnv = (): boolean => {
  if (ENV.SUPABASE_URL === 'YOUR_SUPABASE_URL' || 
      ENV.SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn(
      'Supabase is not configured. Please update src/config/env.ts with your credentials.'
    );
    return false;
  }
  return true;
};

