#!/usr/bin/env node

/**
 * Test Login Debug
 * This script tests the exact login flow that's failing in the app
 */

const https = require('https');

console.log('🧪 Testing Login Debug\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';

console.log('🔧 Test Configuration:');
console.log(`Backend: ${BACKEND_URL}\n`);

// Test user credentials (use the same email from the logs)
const TEST_USER = {
  email: 'akshayjalageri@gmail.com',
  password: 'TestPassword123!' // You'll need to provide the actual password
};

let authCookies = '';

// Test 1: User Login
async function testLogin() {
  console.log('1️⃣ Testing User Login...');
  
  try {
    const response = await makeRequest('/api/auth/login', 'POST', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (response.success) {
      console.log('✅ Login successful!');
      console.log(`   User ID: ${response.user.id || response.user._id}`);
      console.log(`   Email: ${response.user.email}`);
      
      // Store cookies for subsequent requests
      if (response.headers['set-cookie']) {
        authCookies = response.headers['set-cookie'].join('; ');
        console.log('   Cookies set successfully');
        console.log('   Cookie value:', authCookies);
      } else {
        console.log('   ⚠️ No cookies set in response');
      }
      
      return true;
    } else {
      console.log('❌ Login failed:', response.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Login test failed:', error.message);
    return false;
  }
}

// Test 2: Get User Profile (Authenticated) - This is failing in the app
async function testGetProfile() {
  console.log('\n2️⃣ Testing Get User Profile (Authenticated)...');
  
  try {
    const response = await makeRequest('/api/auth/me', 'GET', null, authCookies);
    
    if (response.success) {
      console.log('✅ Get profile successful!');
      console.log(`   User ID: ${response.data.id || response.data._id}`);
      console.log(`   Email: ${response.data.email}`);
      return true;
    } else {
      console.log('❌ Get profile failed:', response.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Get profile test failed:', error.message);
    return false;
  }
}

// Test 3: Test with different cookie formats
async function testCookieFormats() {
  console.log('\n3️⃣ Testing Different Cookie Formats...');
  
  if (!authCookies) {
    console.log('   ⚠️ No cookies to test with');
    return false;
  }
  
  // Test 1: Full cookie string
  console.log('   Testing with full cookie string...');
  try {
    const response = await makeRequest('/api/auth/me', 'GET', null, authCookies);
    if (response.success) {
      console.log('   ✅ Full cookie string works');
      return true;
    }
  } catch (error) {
    console.log('   ❌ Full cookie string failed:', error.message);
  }
  
  // Test 2: Individual cookies
  console.log('   Testing with individual cookies...');
  try {
    const individualCookies = authCookies.split(';').map(c => c.trim()).join('; ');
    const response = await makeRequest('/api/auth/me', 'GET', null, individualCookies);
    if (response.success) {
      console.log('   ✅ Individual cookies work');
      return true;
    }
  } catch (error) {
    console.log('   ❌ Individual cookies failed:', error.message);
  }
  
  return false;
}

// Test 4: Test without cookies (should fail)
async function testWithoutCookies() {
  console.log('\n4️⃣ Testing Without Cookies (Should Fail)...');
  
  try {
    const response = await makeRequest('/api/auth/me', 'GET');
    
    if (response.success) {
      console.log('   ⚠️ Unexpected success without cookies');
      return false;
    } else {
      console.log('   ✅ Correctly failed without cookies');
      return true;
    }
  } catch (error) {
    console.log('   ✅ Correctly failed without cookies');
    return true;
  }
}

// Helper function to make HTTP requests
function makeRequest(path, method, data = null, cookies = '') {
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
    
    if (cookies) {
      options.headers['Cookie'] = cookies;
    }
    
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
          resolve({
            ...response,
            headers: res.headers
          });
        } catch (error) {
          resolve({ 
            success: false, 
            message: 'Invalid JSON response', 
            raw: responseData,
            headers: res.headers
          });
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

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Login Debug Tests...\n');
  
  console.log('⚠️  IMPORTANT: You need to provide the correct password for the email:');
  console.log(`   Email: ${TEST_USER.email}`);
  console.log('   Please update the TEST_USER.password in this script with the correct password\n');
  
  const results = [];
  
  results.push(await testLogin());
  results.push(await testGetProfile());
  results.push(await testCookieFormats());
  results.push(await testWithoutCookies());
  
  console.log('\n🎯 Login Debug Tests Complete!');
  console.log('\n📋 Test Results:');
  console.log(`1. Login: ${results[0] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`2. Get Profile: ${results[1] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`3. Cookie Formats: ${results[2] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`4. Without Cookies: ${results[3] ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (results[1]) {
    console.log('\n🎉 Get Profile is working! The issue might be in the frontend.');
  } else {
    console.log('\n⚠️ Get Profile is still failing. This suggests a backend issue.');
    console.log('\n🔧 Next Steps:');
    console.log('   1. Check if the password is correct');
    console.log('   2. Verify the backend is working properly');
    console.log('   3. Check CORS and cookie settings');
  }
}

runAllTests();
