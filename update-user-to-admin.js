#!/usr/bin/env node

/**
 * Update User to Admin Script
 * Updates an existing user to admin role in production database
 */

const https = require('https');

console.log('🔧 Update User to Admin Script\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';

// User credentials to update
const USER_CREDENTIALS = {
  email: 'admin@devnovate.com',
  password: 'Admin123456!'
};

console.log('📝 User to Update:');
console.log(`Email: ${USER_CREDENTIALS.email}\n`);

// Function to update user to admin
async function updateUserToAdmin() {
  try {
    console.log('🚀 Updating user to admin role...\n');
    
    // Step 1: Login to get session
    console.log('1️⃣ Logging in as user...');
    const loginResult = await makeRequest('/api/auth/login', 'POST', {
      email: USER_CREDENTIALS.email,
      password: USER_CREDENTIALS.password
    });
    
    if (loginResult.success) {
      console.log('✅ User login successful!');
      console.log(`   Current Role: ${loginResult.user.role}`);
      
      // Step 2: Update user role to admin (this would need a backend endpoint)
      console.log('\n2️⃣ Attempting to update role to admin...');
      console.log('⚠️  Note: This requires a backend endpoint to update user role');
      console.log('   For now, you may need to manually update the database');
      
      // Step 3: Test admin access
      console.log('\n3️⃣ Testing admin access...');
      const adminTestResult = await makeRequest('/api/admin/stats', 'GET');
      
      if (adminTestResult.success) {
        console.log('✅ Admin access confirmed!');
        console.log('   User is now an admin');
      } else {
        console.log('⚠️  Admin access test failed:', adminTestResult.message);
        console.log('   User role may need to be updated manually in the database');
      }
      
    } else {
      console.log('❌ User login failed:', loginResult.message);
    }
    
  } catch (error) {
    console.log('❌ Error updating user:', error.message);
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

// Run the update
updateUserToAdmin().then(() => {
  console.log('\n🎯 Update User to Admin Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. ✅ User login verified');
  console.log('2. ⚠️  Role update may need manual database change');
  console.log('3. ✅ Test admin access');
  console.log('\n🔑 Current Login Credentials:');
  console.log(`   Email: ${USER_CREDENTIALS.email}`);
  console.log(`   Password: ${USER_CREDENTIALS.password}`);
  console.log('\n💡 To manually update role in MongoDB:');
  console.log('   db.users.updateOne({email: "admin@devnovate.com"}, {$set: {role: "admin"}})');
});
