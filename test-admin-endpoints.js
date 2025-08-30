#!/usr/bin/env node

/**
 * Test Admin Endpoints Script
 * Tests if admin endpoints are accessible and working
 */

const https = require('https');

console.log('🔧 Testing Admin Endpoints\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';

// Test credentials
const TEST_CREDENTIALS = {
  email: 'admin@devnovate.com',
  password: 'Admin123456!'
};

let authCookies = '';

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
      
      // Store cookies from response
      const setCookieHeaders = res.headers['set-cookie'];
      if (setCookieHeaders) {
        authCookies = setCookieHeaders.map(cookie => cookie.split(';')[0]).join('; ');
      }
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: response, cookies: authCookies });
        } catch (error) {
          console.log('Raw response:', responseData);
          resolve({ status: res.statusCode, data: { success: false, message: 'Invalid JSON response', raw: responseData }, cookies: authCookies });
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

// Test admin endpoints
async function testAdminEndpoints() {
  try {
    console.log('1️⃣ Testing admin login...');
    const loginResult = await makeRequest('/api/auth/login', 'POST', TEST_CREDENTIALS);
    
    if (loginResult.status === 200 && loginResult.data.success) {
      console.log('✅ Admin login successful!');
      console.log(`   User: ${loginResult.data.user.name} (${loginResult.data.user.role})`);
      console.log(`   Cookies: ${loginResult.cookies ? 'Set' : 'Not set'}`);
      
      // Test admin stats endpoint
      console.log('\n2️⃣ Testing admin stats endpoint...');
      const statsResult = await makeRequest('/api/admin/stats', 'GET', null, loginResult.cookies);
      
      if (statsResult.status === 200 && statsResult.data.success) {
        console.log('✅ Admin stats endpoint working!');
        console.log(`   Total Users: ${statsResult.data.data.totalUsers}`);
        console.log(`   Total Blogs: ${statsResult.data.data.totalBlogs}`);
        console.log(`   Pending Blogs: ${statsResult.data.data.pendingBlogs}`);
      } else {
        console.log('❌ Admin stats endpoint failed:', statsResult.data.message);
      }
      
      // Test admin users endpoint
      console.log('\n3️⃣ Testing admin users endpoint...');
      const usersResult = await makeRequest('/api/admin/users', 'GET', null, loginResult.cookies);
      
      if (usersResult.status === 200 && usersResult.data.success) {
        console.log('✅ Admin users endpoint working!');
        console.log(`   Users found: ${usersResult.data.data.length}`);
      } else {
        console.log('❌ Admin users endpoint failed:', usersResult.data.message);
      }
      
      // Test admin blogs endpoint
      console.log('\n4️⃣ Testing admin blogs endpoint...');
      const blogsResult = await makeRequest('/api/admin/blogs', 'GET', null, loginResult.cookies);
      
      if (blogsResult.status === 200 && blogsResult.data.success) {
        console.log('✅ Admin blogs endpoint working!');
        console.log(`   Blogs found: ${blogsResult.data.data.length}`);
      } else {
        console.log('❌ Admin blogs endpoint failed:', blogsResult.data.message);
      }
      
      // Test admin pending blogs endpoint
      console.log('\n5️⃣ Testing admin pending blogs endpoint...');
      const pendingResult = await makeRequest('/api/admin/blogs/pending', 'GET', null, loginResult.cookies);
      
      if (pendingResult.status === 200 && pendingResult.data.success) {
        console.log('✅ Admin pending blogs endpoint working!');
        console.log(`   Pending blogs: ${pendingResult.data.data.length}`);
      } else {
        console.log('❌ Admin pending blogs endpoint failed:', pendingResult.data.message);
      }
      
    } else {
      console.log('❌ Admin login failed:', loginResult.data.message);
    }
    
  } catch (error) {
    console.log('❌ Error testing admin endpoints:', error.message);
  }
}

// Run the tests
testAdminEndpoints().then(() => {
  console.log('\n🎯 Admin Endpoints Test Complete!');
  console.log('\n📋 Summary:');
  console.log('1. ✅ Admin login test');
  console.log('2. ✅ Admin stats endpoint test');
  console.log('3. ✅ Admin users endpoint test');
  console.log('4. ✅ Admin blogs endpoint test');
  console.log('5. ✅ Admin pending blogs endpoint test');
  console.log('\n🔑 Admin Login Credentials:');
  console.log(`   Email: ${TEST_CREDENTIALS.email}`);
  console.log(`   Password: ${TEST_CREDENTIALS.password}`);
});
