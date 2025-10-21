
export const ENV = {
  // Supabase Configuration
  // Replace these with your actual Supabase credentials
  SUPABASE_URL: 'https://ntrgdgayblduxnpejyzo.supabase.co', // e.g., 'https://xxxxx.supabase.co'
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cmdkZ2F5YmxkdXhucGVqeXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTk5ODAsImV4cCI6MjA3NTQ3NTk4MH0.bMyL595GYQeb9efipWujy38H7FS2PkDZfQF5UbCtHBU', // Your Supabase anon/public key
  
  // OAuth Redirect URLs
  // These should match your app's deep link scheme
  REDIRECT_URL: 'kekarapp://auth/callback',
  
  // Google OAuth Configuration
  // Get this from your Google Cloud Console (OAuth 2.0 Client IDs -> Web application)
  GOOGLE_WEB_CLIENT_ID: 'YOUR_GOOGLE_WEB_CLIENT_ID', // Replace with your actual Google Web Client ID
};

/**
 * Validation function to check if environment is properly configured
 */
export const validateEnv = (): boolean => {
  const missingConfigs = [];
  
  if (ENV.SUPABASE_URL === 'YOUR_SUPABASE_URL' || !ENV.SUPABASE_URL) {
    missingConfigs.push('SUPABASE_URL');
  }
  
  if (ENV.SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY' || !ENV.SUPABASE_ANON_KEY) {
    missingConfigs.push('SUPABASE_ANON_KEY');
  }
  
  if (missingConfigs.length > 0) {
    console.error(
      `Missing Supabase configuration: ${missingConfigs.join(', ')}`
    );
    console.error(
      `Please set the following environment variables or update src/config/env.ts:`
    );
    console.error(`- SUPABASE_URL: Your Supabase project URL (e.g., https://xxxxx.supabase.co)`);
    console.error(`- SUPABASE_ANON_KEY: Your Supabase anonymous key`);
    console.error(`\nYou can get these values from your Supabase project dashboard.`);
    return false;
  }
  
  return true;
};

