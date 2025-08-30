#!/usr/bin/env node

/**
 * Test Cookie Fix
 * This script tests if the cookie configuration fix is working
 */

const https = require('https');

console.log('🧪 Testing Cookie Fix\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';

// Test user credentials
const TEST_USER = {
  name: 'Test User Cookie',
  email: `test${Date.now()}@example.com`,
  password: 'TestPassword123!'
};

let authCookies = '';

// Test 1: User Registration with Cookie Check
async function testRegistrationWithCookie() {
  console.log('1️⃣ Testing User Registration with Cookie Check...');
  
  try {
    const response = await makeRequest('/api/auth/register', 'POST', TEST_USER);
    
    if (response.success) {
      console.log('✅ Registration successful!');
      console.log(`   User ID: ${response.user.id || response.user._id}`);
      console.log(`   Email: ${response.user.email}`);
      
      // Check if cookies are set
      if (response.headers['set-cookie']) {
        authCookies = response.headers['set-cookie'].join('; ');
        console.log('   ✅ Cookies set successfully');
        console.log('   Cookie details:');
        response.headers['set-cookie'].forEach((cookie, index) => {
          console.log(`     ${index + 1}. ${cookie}`);
        });
      } else {
        console.log('   ❌ No cookies set in response');
        return false;
      }
      
      return true;
    } else {
      console.log('❌ Registration failed:', response.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Registration test failed:', error.message);
    return false;
  }
}

// Test 2: User Login with Cookie Check
async function testLoginWithCookie() {
  console.log('\n2️⃣ Testing User Login with Cookie Check...');
  
  try {
    const response = await makeRequest('/api/auth/login', 'POST', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (response.success) {
      console.log('✅ Login successful!');
      console.log(`   User ID: ${response.user.id || response.user._id}`);
      console.log(`   Email: ${response.user.email}`);
      
      // Check if cookies are set
      if (response.headers['set-cookie']) {
        authCookies = response.headers['set-cookie'].join('; ');
        console.log('   ✅ Cookies updated successfully');
        console.log('   Cookie details:');
        response.headers['set-cookie'].forEach((cookie, index) => {
          console.log(`     ${index + 1}. ${cookie}`);
        });
      } else {
        console.log('   ❌ No cookies set in response');
        return false;
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

// Test 3: Get User Profile with Cookies
async function testGetProfileWithCookies() {
  console.log('\n3️⃣ Testing Get User Profile with Cookies...');
  
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
  console.log('🚀 Starting Cookie Fix Tests...\n');
  
  const results = [];
  
  results.push(await testRegistrationWithCookie());
  results.push(await testLoginWithCookie());
  results.push(await testGetProfileWithCookies());
  results.push(await testWithoutCookies());
  
  console.log('\n🎯 Cookie Fix Tests Complete!');
  console.log('\n📋 Test Results:');
  console.log(`1. Registration with Cookie: ${results[0] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`2. Login with Cookie: ${results[1] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`3. Get Profile with Cookies: ${results[2] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`4. Without Cookies (Should Fail): ${results[3] ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Cookie configuration is working correctly.');
    console.log('\n🔧 The cookie fix should resolve the authentication issues.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.');
  }
}

runAllTests();
