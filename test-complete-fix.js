#!/usr/bin/env node

/**
 * Test Complete Fix
 * This script tests all the fixes to ensure the app works error-free
 */

const https = require('https');

console.log('🧪 Testing Complete Fix\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';

console.log('🔧 Test Configuration:');
console.log(`Backend: ${BACKEND_URL}\n`);

// Test user credentials
const TEST_USER = {
  name: 'Test User Complete',
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
      console.log(`   Role: ${response.user.role}`);
      
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
      console.log(`   Role: ${response.data.role}`);
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

// Test 4: Access Protected Route
async function testProtectedRoute() {
  console.log('\n4️⃣ Testing Protected Route Access...');
  
  try {
    const response = await makeRequest('/api/users/profile', 'GET', null, authCookies);
    
    if (response.success) {
      console.log('✅ Protected route access successful!');
      console.log(`   User ID: ${response.data.id || response.data._id}`);
      console.log(`   Email: ${response.data.email}`);
      return true;
    } else {
      console.log('❌ Protected route access failed:', response.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Protected route test failed:', error.message);
    return false;
  }
}

// Test 5: Test Blogs Endpoint (Public)
async function testBlogsEndpoint() {
  console.log('\n5️⃣ Testing Blogs Endpoint (Public)...');
  
  try {
    const response = await makeRequest('/api/blogs', 'GET');
    
    if (response.success) {
      console.log('✅ Blogs endpoint working!');
      console.log(`   Count: ${response.count}`);
      console.log(`   Data length: ${response.data.length}`);
      return true;
    } else {
      console.log('❌ Blogs endpoint failed:', response.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Blogs endpoint test failed:', error.message);
    return false;
  }
}

// Test 6: Test Trending Blogs Endpoint
async function testTrendingBlogsEndpoint() {
  console.log('\n6️⃣ Testing Trending Blogs Endpoint...');
  
  try {
    const response = await makeRequest('/api/blogs/trending', 'GET');
    
    if (response.success) {
      console.log('✅ Trending blogs endpoint working!');
      console.log(`   Count: ${response.count || 'N/A'}`);
      console.log(`   Data length: ${response.data.length}`);
      return true;
    } else {
      console.log('❌ Trending blogs endpoint failed:', response.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Trending blogs endpoint test failed:', error.message);
    return false;
  }
}

// Test 7: Test Create Blog (Authenticated)
async function testCreateBlog() {
  console.log('\n7️⃣ Testing Create Blog (Authenticated)...');
  
  try {
    const blogData = {
      title: 'Test Blog',
      content: 'This is a test blog post.',
      tags: ['test', 'example'],
      excerpt: 'A test blog post for testing purposes.'
    };
    
    const response = await makeRequest('/api/blogs', 'POST', blogData, authCookies);
    
    if (response.success) {
      console.log('✅ Create blog successful!');
      console.log(`   Blog ID: ${response.data.id || response.data._id}`);
      console.log(`   Title: ${response.data.title}`);
      return true;
    } else {
      console.log('❌ Create blog failed:', response.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Create blog test failed:', error.message);
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
  console.log('🚀 Starting Complete Fix Tests...\n');
  
  const results = [];
  
  results.push(await testRegistration());
  results.push(await testLogin());
  results.push(await testGetProfile());
  results.push(await testProtectedRoute());
  results.push(await testBlogsEndpoint());
  results.push(await testTrendingBlogsEndpoint());
  results.push(await testCreateBlog());
  
  console.log('\n🎯 Complete Fix Tests Complete!');
  console.log('\n📋 Test Results:');
  console.log(`1. Registration: ${results[0] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`2. Login: ${results[1] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`3. Get Profile: ${results[2] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`4. Protected Route: ${results[3] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`5. Blogs Endpoint: ${results[4] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`6. Trending Blogs: ${results[5] ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`7. Create Blog: ${results[6] ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your app should work error-free now!');
    console.log('\n💡 What This Fixes:');
    console.log('   - ✅ User registration and authentication');
    console.log('   - ✅ Login without "not authorized" errors');
    console.log('   - ✅ No more "failed to fetch blogs" loops');
    console.log('   - ✅ Submit blog button works properly');
    console.log('   - ✅ Protected routes accessible after login');
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.');
    console.log('\n🔧 Next Steps:');
    console.log('   1. Check the failed tests above');
    console.log('   2. Verify backend is running properly');
    console.log('   3. Check CORS configuration');
  }
}

runAllTests();
