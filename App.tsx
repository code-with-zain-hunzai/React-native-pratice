/**
 * Kekar App
 * Travel Agency App with Bottom Navigation
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View, Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  SignInScreen,
  SignUpScreen,
  HomeScreen,
  WishlistScreen,
  TripScreen,
  ProfileScreen,
} from './src/screens';
import { BottomTabBar, TabName } from './src/components';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

function AppContent() {
  const { isAuthenticated, signOut, handleOAuthCallback } = useAuth();
  const [authScreen, setAuthScreen] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState<TabName>('Home');


  const handlePlacePress = (id: string) => {
    console.log('Place pressed:', id);
    // Navigate to place detail screen
  };

  const handleTripPress = (id: string) => {
    console.log('Trip pressed:', id);
    // Navigate to trip detail screen
  };

  const handleMenuItemPress = (action: string) => {
    console.log('Menu item pressed:', action);
    // Handle menu actions
  };

  const handleNavigateToHome = () => {
    setActiveTab('Home');
  };

  const handleNavigateToProfile = () => {
    setActiveTab('Profile');
  };

  const handleNavigateToTrip = () => {
    setActiveTab('Trip');
  };

  const handleNavigateToWishlist = () => {
    setActiveTab('Wishlist');
  };


  // Reset to home tab when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      setActiveTab('Home');
    }
  }, [isAuthenticated]);

  // Handle deep links for OAuth callbacks
  useEffect(() => {
    // Handle initial URL if app was opened from a deep link
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    // Handle deep links while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    handleInitialURL();

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = async (url: string) => {
    try {
      // Check if this is an OAuth callback
      if (url.includes('kekarapp://auth/callback')) {
        await handleOAuthCallback(url);
        
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: 'You have successfully signed in.',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.error('Deep link error:', error);
      Toast.show({
        type: 'error',
        text1: 'Authentication Failed',
        text2: error?.message || 'Failed to complete authentication.',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  };

  const renderMainApp = () => {
    return (
      <View style={styles.container}>
        {activeTab === 'Home' && (
          <HomeScreen
            onPlacePress={handlePlacePress}
            onNavigateToWishlist={handleNavigateToWishlist}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToTrip={handleNavigateToTrip}
          />
        )}
        {activeTab === 'Wishlist' && (
          <WishlistScreen
            onPlacePress={handlePlacePress}
            onNavigateToHome={handleNavigateToHome}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToTrip={handleNavigateToTrip}
          />
        )}
        {activeTab === 'Trip' && (
          <TripScreen
            onTripPress={handleTripPress}
            onNavigateToHome={handleNavigateToHome}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToWishlist={handleNavigateToWishlist}
          />
        )}
        {activeTab === 'Profile' && (
          <ProfileScreen
            onMenuItemPress={handleMenuItemPress}
            onNavigateToHome={handleNavigateToHome}
            onNavigateToTrip={handleNavigateToTrip}
            onNavigateToWishlist={handleNavigateToWishlist}
          />
        )}
        <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    );
  };

  const renderAuthScreens = () => {
    if (authScreen === 'signin') {
      return (
        <SignInScreen 
          onNavigateToSignUp={() => setAuthScreen('signup')}
        />
      );
    }
    return (
      <SignUpScreen 
        onNavigateToSignIn={() => setAuthScreen('signin')}
      />
    );
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {isAuthenticated ? renderMainApp() : renderAuthScreens()}
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
