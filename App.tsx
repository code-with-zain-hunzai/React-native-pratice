/**
 * Kekar App
 * Travel Agency App with Bottom Navigation
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, Alert } from 'react-native';
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
  const { isAuthenticated, signOut } = useAuth();
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

  const handleLogout = async () => {
    try {
      await signOut();
      setAuthScreen('signin');
      setActiveTab('Home'); // Reset to home tab
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out.',
        position: 'top',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'An error occurred while logging out.',
        position: 'top',
      });
    }
  };

  // Reset to home tab when user logs in
  React.useEffect(() => {
    if (isAuthenticated) {
      setActiveTab('Home');
    }
  }, [isAuthenticated]);

  const renderMainApp = () => {
    return (
      <View style={styles.container}>
        {activeTab === 'Home' && (
          <HomeScreen
            onPlacePress={handlePlacePress}
            onNavigateToWishlist={() => setActiveTab('Wishlist')}
          />
        )}
        {activeTab === 'Wishlist' && (
          <WishlistScreen
            onPlacePress={handlePlacePress}
            onNavigateToHome={() => setActiveTab('Home')}
          />
        )}
        {activeTab === 'Trip' && <TripScreen onTripPress={handleTripPress} />}
        {activeTab === 'Profile' && (
          <ProfileScreen
            onMenuItemPress={handleMenuItemPress}
            onLogout={handleLogout}
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
