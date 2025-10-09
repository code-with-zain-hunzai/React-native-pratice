/**
 * API Connection Test Utility
 * Use this to test your backend connection
 */

import apiClient from '../api/api';
import authService from '../services/authService';
import { API_BASE_URL } from '../api/constant';

/**
 * Test if the backend is reachable
 */
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing backend connection...');
    console.log('📡 Backend URL:', API_BASE_URL);
    
    // Try to hit a health endpoint or any endpoint
    const response = await apiClient.get('/health');
    
    console.log('✅ Backend is reachable!');
    console.log('Response:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ Backend connection failed');
    
    if (error.message?.includes('Network Error') || error.message?.includes('connect')) {
      console.error('💡 Make sure:');
      console.error('   1. Backend server is running on the correct port');
      console.error('   2. You are using the correct IP address');
      console.error('   3. Firewall is not blocking the connection');
      console.error('   4. Android: Use 10.0.2.2 for emulator');
      console.error('   5. iOS: Use localhost or 127.0.0.1');
    }
    
    console.error('Error details:', error);
    return false;
  }
};

/**
 * Test authentication endpoints
 */
export const testAuthEndpoints = async () => {
  console.log('\n🧪 Testing Authentication Endpoints...\n');
  
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'password123';
  const testName = 'Test User';
  
  try {
    // Test Sign Up
    console.log('📝 Testing Sign Up...');
    const signUpResponse = await authService.signUp({
      email: testEmail,
      password: testPassword,
      name: testName,
    });
    console.log('✅ Sign Up successful!');
    console.log('User:', signUpResponse.data?.user);
    
    // Test Sign Out
    console.log('\n🚪 Testing Sign Out...');
    await authService.signOut();
    console.log('✅ Sign Out successful!');
    
    // Test Sign In
    console.log('\n🔐 Testing Sign In...');
    const signInResponse = await authService.signIn({
      email: testEmail,
      password: testPassword,
    });
    console.log('✅ Sign In successful!');
    console.log('User:', signInResponse.data?.user);
    
    // Test Get Current User
    console.log('\n👤 Testing Get Current User...');
    const currentUser = await authService.getCurrentUser();
    console.log('✅ Get Current User successful!');
    console.log('User:', currentUser);
    
    console.log('\n🎉 All authentication tests passed!');
    
    // Clean up
    await authService.signOut();
    
    return true;
  } catch (error: any) {
    console.error('\n❌ Authentication test failed:');
    console.error('Error:', error.message || error);
    return false;
  }
};

/**
 * Run all API tests
 */
export const runAllTests = async () => {
  console.log('🚀 Starting API Tests...\n');
  console.log('='.repeat(50));
  
  // Test connection first
  const connectionOk = await testBackendConnection();
  
  if (!connectionOk) {
    console.log('\n⚠️  Cannot proceed with further tests. Fix connection first.');
    return;
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test authentication
  await testAuthEndpoints();
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ All tests completed!\n');
};

/**
 * Get network debugging info
 */
export const getNetworkDebugInfo = () => {
  console.log('\n📊 Network Debug Information:');
  console.log('─'.repeat(50));
  console.log('Backend URL:', API_BASE_URL);
  console.log('Environment:', __DEV__ ? 'Development' : 'Production');
  console.log('Platform:', require('react-native').Platform.OS);
  console.log('\n💡 Network Tips:');
  console.log('  Android Emulator: http://10.0.2.2:3000/api');
  console.log('  iOS Simulator: http://localhost:3000/api');
  console.log('  Physical Device: http://YOUR_IP:3000/api');
  console.log('─'.repeat(50) + '\n');
};

/**
 * Example usage in your App.tsx or a test screen:
 * 
 * import { runAllTests, getNetworkDebugInfo } from './utils/apiTest';
 * 
 * // In your component
 * useEffect(() => {
 *   getNetworkDebugInfo();
 *   runAllTests();
 * }, []);
 */

