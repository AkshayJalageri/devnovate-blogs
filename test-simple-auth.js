#!/usr/bin/env node

/**
 * Simple Auth Test
 * This script tests the basic authentication flow
 */

const https = require('https');

console.log('🧪 Simple Auth Test\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';

// Test user credentials
const TEST_USER = {
  name: 'Test User Simple',
  email: `test${Date.now()}@example.com`,
  password: 'TestPassword123!'
};

let authCookies = '';

// Test 1: User Registration
async function testRegistration() {
  console.log('1️⃣ Testing User Registration...');
  
  try {
    const response = await makeRequest('/api/auth/register', 'POST', TEST_USER);
    
    if (response.success) {
      console.log('✅ Registration successful!');
      console.log(`   User ID: ${response.user.id || response.user._id}`);
      console.log(`   Email: ${response.user.email}`);
      
      // Store cookies for subsequent requests
      if (response.headers['set-cookie']) {
        authCookies = response.headers['set-cookie'].join('; ');
        console.log('   Cookies set successfully');
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

// Test 2: User Login
async function testLogin() {
  console.log('\n2️⃣ Testing User Login...');
  
  try {
    const response = await makeRequest('/api/auth/login', 'POST', {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (response.success) {
      console.log('✅ Login successful!');
      console.log(`   User ID: ${response.user.id || response.user._id}`);
      console.log(`   Email: ${response.user.email}`);
      
      // Update cookies
      if (response.headers['set-cookie']) {
        authCookies = response.headers['set-cookie'].join('; ');
        console.log('   Cookies updated successfully');
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

// Test 3: Get User Profile (Authenticated)
async function testGetProfile() {
  console.log('\n3️⃣ Testing Get User Profile (Authenticated)...');
  
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
  console.log('🚀 Starting Simple Auth Tests...\n');
  
  const results = [];
  
  results.push(await testRegistration());
  results.push(await testLogin());
  results.push(await testGetProfile());
  
  console.log('\n🎯 Simple Auth Tests Complete!');
  console.log('\n📋 Test Results:');
  console.log(`1. Registration: ${results[0] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`2. Login: ${results[1] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`3. Get Profile: ${results[2] ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Authentication is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.');
  }
}

runAllTests();
