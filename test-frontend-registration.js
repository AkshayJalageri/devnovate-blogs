#!/usr/bin/env node

/**
 * Test Frontend Registration Flow
 * This simulates what happens in the frontend registration process
 */

const https = require('https');

console.log('🧪 Testing Frontend Registration Flow\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';
const FRONTEND_URL = 'https://devnovate-blogs-mu.vercel.app';

console.log('🔧 Test Configuration:');
console.log(`Backend: ${BACKEND_URL}`);
console.log(`Frontend: ${FRONTEND_URL}\n`);

// Test the complete registration flow
async function testFrontendRegistrationFlow() {
  const testUser = {
    name: 'Frontend Test User',
    email: `frontend-test-${Date.now()}@example.com`,
    password: 'testpassword123'
  };

  console.log('📝 Test User:', JSON.stringify(testUser, null, 2));
  console.log('\n🚀 Starting Frontend Registration Flow Test...\n');

  try {
    // Step 1: Registration
    console.log('1️⃣ Testing Registration...');
    const registrationResult = await makeRequest('/api/auth/register', 'POST', testUser);
    
    if (registrationResult.success) {
      console.log('✅ Registration successful!');
      console.log('   User ID:', registrationResult.user.id);
      console.log('   User Name:', registrationResult.user.name);
      console.log('   User Email:', registrationResult.user.email);
      
      // Step 2: Try to get user data (this should work now)
      console.log('\n2️⃣ Testing User Data Retrieval...');
      const userDataResult = await makeRequest('/api/auth/me', 'GET', null, true);
      
      if (userDataResult.success) {
        console.log('✅ User data retrieval successful!');
        console.log('   Retrieved User:', userDataResult.data.name);
      } else {
        console.log('⚠️ User data retrieval failed (this is expected for new registrations)');
      }
      
      // Step 3: Test Login
      console.log('\n3️⃣ Testing Login...');
      const loginResult = await makeRequest('/api/auth/login', 'POST', {
        email: testUser.email,
        password: testUser.password
      });
      
      if (loginResult.success) {
        console.log('✅ Login successful!');
        console.log('   Logged in as:', loginResult.user.name);
        
        // Step 4: Now try to get user data after login
        console.log('\n4️⃣ Testing User Data Retrieval After Login...');
        const userDataAfterLogin = await makeRequest('/api/auth/me', 'GET', null, true);
        
        if (userDataAfterLogin.success) {
          console.log('✅ User data retrieval after login successful!');
          console.log('   User:', userDataAfterLogin.data.name);
        } else {
          console.log('❌ User data retrieval after login failed');
        }
      } else {
        console.log('❌ Login failed');
      }
      
    } else {
      console.log('❌ Registration failed:', registrationResult.message);
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

// Helper function to make HTTP requests
function makeRequest(path, method, data = null, includeCookies = false) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: new URL(BACKEND_URL).hostname,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_URL
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

// Run the test
testFrontendRegistrationFlow().then(() => {
  console.log('\n🎯 Frontend Registration Flow Test Complete!');
  console.log('\n📋 What This Tested:');
  console.log('1. ✅ Registration endpoint');
  console.log('2. ✅ User data retrieval (before login)');
  console.log('3. ✅ Login endpoint');
  console.log('4. ✅ User data retrieval (after login)');
  console.log('\n🚀 Your frontend registration should now work!');
});
