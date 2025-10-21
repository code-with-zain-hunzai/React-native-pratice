import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import authService from '../services/authService';
import { validateEnv } from '../config/env';

interface GoogleSignInButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
  style?: any;
  textStyle?: any;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  style,
  textStyle,
}) => {
  const [loading, setLoading] = useState(false);

  // Configure Google Sign-In
  React.useEffect(() => {
    const configureGoogleSignIn = async () => {
      try {
        // Validate environment configuration
        if (!validateEnv()) {
          Alert.alert(
            'Configuration Error',
            'Please configure your Google OAuth credentials in src/config/env.ts'
          );
          return;
        }

        // Configure Google Sign-In
        GoogleSignin.configure({
          webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID', // Use your web client ID here
          offlineAccess: true,
          hostedDomain: '',
          forceCodeForRefreshToken: true,
        });
      } catch (error) {
        console.error('Google Sign-In configuration error:', error);
      }
    };

    configureGoogleSignIn();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();
      
      if (userInfo.data?.idToken) {
        // Use the backend Google OAuth flow
        const authResponse = await authService.signInWithGoogleBackend(
          userInfo.data.idToken,
          userInfo.data.accessToken
        );

        if (authResponse.success) {
          onSuccess?.(authResponse.data?.user);
          Alert.alert('Success', 'Google sign in successful!');
        } else {
          throw new Error(authResponse.message || 'Google sign in failed');
        }
      } else {
        throw new Error('No ID token received from Google');
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      let errorMessage = 'Google sign in failed';
      
      if (error.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Sign in was cancelled';
      } else if (error.code === 'IN_PROGRESS') {
        errorMessage = 'Sign in is already in progress';
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Google Play Services not available';
      } else if (error.message) {
        errorMessage = error.message;
      }

      onError?.(error);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSupabaseOAuth = async () => {
    try {
      setLoading(true);
      
      // Use Supabase OAuth flow (alternative method)
      await authService.signInWithOAuth('google');
    } catch (error) {
      console.error('Supabase OAuth error:', error);
      onError?.(error);
      Alert.alert('Error', 'OAuth sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.buttonText, textStyle]}>
            Sign in with Google (Backend)
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.supabaseButton, style]}
        onPress={handleSupabaseOAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.buttonText, textStyle]}>
            Sign in with Google (Supabase)
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    minHeight: 48,
  },
  supabaseButton: {
    backgroundColor: '#3ECF8E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GoogleSignInButton;
