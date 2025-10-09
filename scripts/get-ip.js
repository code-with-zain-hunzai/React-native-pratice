#!/usr/bin/env node

/**
 * Script to find your local IP address for testing on physical devices
 * Usage: node scripts/get-ip.js
 */

const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.internal || iface.family !== 'IPv4') {
        continue;
      }
      
      addresses.push({
        name,
        address: iface.address,
        type: iface.family
      });
    }
  }

  return addresses;
}

console.log('\n📡 Network Configuration Helper\n');
console.log('═'.repeat(60));
console.log('\n🔍 Your Local IP Addresses:\n');

const addresses = getLocalIPAddress();

if (addresses.length === 0) {
  console.log('❌ No network interfaces found.');
  console.log('   Make sure you are connected to a network.\n');
} else {
  addresses.forEach((addr, index) => {
    console.log(`${index + 1}. ${addr.name}:`);
    console.log(`   IP: ${addr.address}`);
    console.log('');
  });
  
  const primaryIP = addresses[0].address;
  
  console.log('─'.repeat(60));
  console.log('\n💡 Update your API configuration:\n');
  console.log('Edit: KekarApp/src/api/constant.ts\n');
  console.log('For different platforms:\n');
  console.log('  📱 Android Emulator:');
  console.log('     http://10.0.2.2:3000/api\n');
  console.log('  📱 iOS Simulator:');
  console.log('     http://localhost:3000/api\n');
  console.log('  📱 Physical Device (Android/iOS):');
  console.log(`     http://${primaryIP}:3000/api\n`);
  console.log('─'.repeat(60));
  console.log('\n⚠️  Important:');
  console.log('   1. Make sure your device and computer are on the same WiFi');
  console.log('   2. Backend server must be running on port 3000');
  console.log('   3. Firewall should allow connections on port 3000');
  console.log('   4. Use HTTPS in production\n');
  console.log('═'.repeat(60));
  console.log('\n✅ Copy the IP address above and update your constant.ts file\n');
}

console.log('Example configuration:\n');
console.log('export const API_BASE_URL = __DEV__');
console.log('  ? Platform.select({');
console.log('      android: \'http://10.0.2.2:3000/api\',  // Android Emulator');
console.log('      ios: \'http://localhost:3000/api\',      // iOS Simulator');
if (addresses.length > 0) {
  console.log(`      // For physical devices: 'http://${addresses[0].address}:3000/api'`);
}
console.log('    })');
console.log('  : \'https://your-production-api.com/api\';\n');

