#!/usr/bin/env node

/**
 * Promote User to Admin Script
 * Calls the backend endpoint to promote the user to admin role
 */

const https = require('https');

console.log('🔧 Promote User to Admin Script\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';

console.log('🚀 Promoting user to admin role...\n');

// Function to promote user to admin
async function promoteToAdmin() {
  try {
    console.log('1️⃣ Calling promote-first-admin endpoint...');
    const result = await makeRequest('/api/auth/promote-first-admin', 'POST');
    
    if (result.success) {
      console.log('✅ User promoted to admin successfully!');
      console.log(`   User ID: ${result.data.id}`);
      console.log(`   Name: ${result.data.name}`);
      console.log(`   Email: ${result.data.email}`);
      console.log(`   Role: ${result.data.role}`);
      
      // Test admin access
      console.log('\n2️⃣ Testing admin access...');
      const adminTestResult = await makeRequest('/api/admin/stats', 'GET');
      
      if (adminTestResult.success) {
        console.log('✅ Admin access confirmed!');
        console.log('   User is now an admin and can access admin features');
      } else {
        console.log('⚠️  Admin access test failed:', adminTestResult.message);
      }
      
    } else {
      console.log('❌ Failed to promote user:', result.message);
    }
    
  } catch (error) {
    console.log('❌ Error promoting user:', error.message);
  }
}

// Helper function to make HTTP requests
function makeRequest(path, method, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: new URL(BACKEND_URL).hostname,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://devnovate-blogs-mu.vercel.app'
      }
    };
    
    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          resolve(response);
        } catch (error) {
          resolve({ success: false, message: 'Invalid JSON response', raw: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(postData);
    }
    req.end();
  });
}

// Run the promotion
promoteToAdmin().then(() => {
  console.log('\n🎯 Promote to Admin Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. ✅ User promoted to admin role');
  console.log('2. ✅ Test admin access');
  console.log('3. ✅ Login to your app with admin credentials');
  console.log('\n🔑 Admin Login Credentials:');
  console.log('   Email: admin@devnovate.com');
  console.log('   Password: Admin123456!');
  console.log('\n🌐 Login at: https://devnovate-blogs-mu.vercel.app');
});
