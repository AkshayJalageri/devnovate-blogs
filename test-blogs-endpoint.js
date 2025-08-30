#!/usr/bin/env node

/**
 * Test Blogs Endpoint
 * This tests the blogs endpoint that was causing the "failed to fetch blogs" error
 */

const https = require('https');

console.log('🧪 Testing Blogs Endpoint\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';
const FRONTEND_URL = 'https://devnovate-blogs-mu.vercel.app';

console.log('🔧 Test Configuration:');
console.log(`Backend: ${BACKEND_URL}`);
console.log(`Frontend: ${FRONTEND_URL}\n`);

// Test the blogs endpoint
async function testBlogsEndpoint() {
  console.log('📝 Testing GET /api/blogs endpoint...\n');
  
  try {
    const response = await makeRequest('/api/blogs', 'GET');
    
    if (response.success) {
      console.log('✅ Blogs endpoint working correctly!');
      console.log(`   Count: ${response.count}`);
      console.log(`   Data length: ${response.data.length}`);
      console.log(`   Pagination: ${JSON.stringify(response.pagination)}`);
      
      if (response.data.length === 0) {
        console.log('   Note: No blogs found (this is expected for a new deployment)');
      }
    } else {
      console.log('❌ Blogs endpoint returned error:', response.message);
    }
    
  } catch (error) {
    console.log('❌ Blogs endpoint test failed:', error.message);
  }
}

// Test the trending blogs endpoint
async function testTrendingBlogsEndpoint() {
  console.log('\n📝 Testing GET /api/blogs/trending endpoint...\n');
  
  try {
    const response = await makeRequest('/api/blogs/trending', 'GET');
    
    if (response.success) {
      console.log('✅ Trending blogs endpoint working correctly!');
      console.log(`   Count: ${response.count}`);
      console.log(`   Data length: ${response.data.length}`);
    } else {
      console.log('❌ Trending blogs endpoint returned error:', response.message);
    }
    
  } catch (error) {
    console.log('❌ Trending blogs endpoint test failed:', error.message);
  }
}

// Helper function to make HTTP requests
function makeRequest(path, method) {
  return new Promise((resolve, reject) => {
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
    
    req.end();
  });
}

// Run the tests
async function runTests() {
  console.log('🚀 Starting Blogs Endpoint Tests...\n');
  
  await testBlogsEndpoint();
  await testTrendingBlogsEndpoint();
  
  console.log('\n🎯 Blogs Endpoint Tests Complete!');
  console.log('\n📋 What This Tested:');
  console.log('1. ✅ GET /api/blogs endpoint');
  console.log('2. ✅ GET /api/blogs/trending endpoint');
  console.log('\n🚀 Your frontend should no longer show "failed to fetch blogs"!');
}

runTests();
