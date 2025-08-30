#!/usr/bin/env node

/**
 * Production Admin Creation Script
 * Run this to create an admin user in your production database
 */

const https = require('https');

console.log('🔧 Production Admin Creation Script\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';

// Admin credentials - CHANGE THESE!
const ADMIN_CREDENTIALS = {
  name: 'Admin User',
  email: 'admin@devnovate.com', // CHANGE THIS TO YOUR EMAIL
  password: 'Admin123456!' // CHANGE THIS TO A STRONG PASSWORD
};

console.log('📝 Admin Credentials:');
console.log(`Name: ${ADMIN_CREDENTIALS.name}`);
console.log(`Email: ${ADMIN_CREDENTIALS.email}`);
console.log(`Password: ${ADMIN_CREDENTIALS.password}\n`);

console.log('⚠️  IMPORTANT: Change the credentials in this script before running!\n');

// Function to create admin user
async function createProductionAdmin() {
  try {
    console.log('🚀 Creating admin user in production...\n');
    
    // Step 1: Register the admin user
    console.log('1️⃣ Registering admin user...');
    const registrationResult = await makeRequest('/api/auth/register', 'POST', ADMIN_CREDENTIALS);
    
    if (registrationResult.success) {
      console.log('✅ Admin user registered successfully!');
      console.log(`   User ID: ${registrationResult.user.id}`);
      console.log(`   Role: ${registrationResult.user.role}`);
      
      // Step 2: Login to get session
      console.log('\n2️⃣ Logging in as admin...');
      const loginResult = await makeRequest('/api/auth/login', 'POST', {
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password
      });
      
      if (loginResult.success) {
        console.log('✅ Admin login successful!');
        
        // Step 3: Test admin access
        console.log('\n3️⃣ Testing admin access...');
        const adminTestResult = await makeRequest('/api/admin/stats', 'GET');
        
        if (adminTestResult.success) {
          console.log('✅ Admin access confirmed!');
          console.log('   Admin user is working correctly');
        } else {
          console.log('⚠️  Admin access test failed:', adminTestResult.message);
        }
        
      } else {
        console.log('❌ Admin login failed:', loginResult.message);
      }
      
    } else {
      console.log('❌ Admin registration failed:', registrationResult.message);
      
      // Check if user already exists
      if (registrationResult.message.includes('already exists')) {
        console.log('\n🔄 User already exists, trying to login...');
        
        const loginResult = await makeRequest('/api/auth/login', 'POST', {
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password
        });
        
        if (loginResult.success) {
          console.log('✅ Admin login successful!');
          console.log(`   Role: ${loginResult.user.role}`);
          
          if (loginResult.user.role === 'admin') {
            console.log('✅ User is already an admin!');
          } else {
            console.log('⚠️  User exists but is not an admin');
            console.log('   You may need to manually update the role in your database');
          }
        } else {
          console.log('❌ Admin login failed:', loginResult.message);
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Error creating admin:', error.message);
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

// Check if credentials are default
if (ADMIN_CREDENTIALS.email === 'admin@devnovate.com' || ADMIN_CREDENTIALS.password === 'Admin123456!') {
  console.log('❌ Please change the default admin credentials in this script before running!');
  console.log('   Edit the ADMIN_CREDENTIALS object with your desired email and password');
  process.exit(1);
}

// Run the admin creation
createProductionAdmin().then(() => {
  console.log('\n🎯 Production Admin Creation Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. ✅ Admin user created (or verified existing)');
  console.log('2. ✅ Test admin login with your credentials');
  console.log('3. ✅ Access admin dashboard in your app');
  console.log('\n🔑 Admin Login Credentials:');
  console.log(`   Email: ${ADMIN_CREDENTIALS.email}`);
  console.log(`   Password: ${ADMIN_CREDENTIALS.password}`);
});
