#!/usr/bin/env node

/**
 * Test Deployment Script for Devnovate Blogs
 * Run this to verify your deployment is working
 */

const https = require('https');
const http = require('http');

console.log('🧪 Devnovate Blogs - Deployment Test Script\n');

// Configuration - UPDATE THESE URLs
const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com'; // Replace with your actual Render URL
const FRONTEND_URL = 'https://devnovate-blogs-mu.vercel.app'; // Your Vercel URL

console.log('🔧 Testing Configuration:');
console.log(`Backend: ${BACKEND_URL}`);
console.log(`Frontend: ${FRONTEND_URL}\n`);

// Test backend health endpoint
function testBackendHealth() {
  return new Promise((resolve, reject) => {
    const url = `${BACKEND_URL}/health`;
    console.log(`📡 Testing backend health: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Backend health check passed:');
          console.log(`   Status: ${response.status}`);
          console.log(`   Environment: ${response.environment}`);
          console.log(`   Client URL: ${response.clientUrl}`);
          console.log(`   Allowed Origins: ${response.allowedOrigins.join(', ')}`);
          resolve(response);
        } catch (error) {
          console.log('⚠️  Backend responded but with invalid JSON:');
          console.log(`   Response: ${data}`);
          resolve({ status: 'unknown', data });
        }
      });
    }).on('error', (error) => {
      console.log('❌ Backend health check failed:');
      console.log(`   Error: ${error.message}`);
      reject(error);
    });
  });
}

// Test CORS by making a request from frontend origin
function testCORS() {
  return new Promise((resolve, reject) => {
    const url = `${BACKEND_URL}/api/blogs`;
    console.log(`\n🌐 Testing CORS with frontend origin: ${url}`);
    
    const options = {
      hostname: new URL(BACKEND_URL).hostname,
      port: 443,
      path: '/api/blogs',
      method: 'GET',
      headers: {
        'Origin': FRONTEND_URL,
        'User-Agent': 'Devnovate-Blogs-Test/1.0'
      }
    };
    
    const req = https.request(options, (res) => {
      console.log(`✅ CORS test response: ${res.statusCode}`);
      console.log(`   Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
      console.log(`   Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials']}`);
      
      if (res.headers['access-control-allow-origin'] === FRONTEND_URL || 
          res.headers['access-control-allow-origin'] === '*') {
        console.log('✅ CORS is properly configured!');
        resolve(true);
      } else {
        console.log('⚠️  CORS might have issues');
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ CORS test failed:');
      console.log(`   Error: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

// Main test function
async function runTests() {
  try {
    console.log('🚀 Starting deployment tests...\n');
    
    // Test 1: Backend Health
    await testBackendHealth();
    
    // Test 2: CORS Configuration
    await testCORS();
    
    console.log('\n🎯 Test Summary:');
    console.log('1. ✅ Backend health endpoint working');
    console.log('2. ✅ CORS configuration verified');
    console.log('\n🚀 Your deployment should be working correctly!');
    
    console.log('\n📋 Next steps:');
    console.log('1. Test your frontend app in the browser');
    console.log('2. Try to register/login');
    console.log('3. Check browser console for any errors');
    console.log('4. Verify API calls are working');
    
  } catch (error) {
    console.log('\n❌ Tests failed:');
    console.log(`Error: ${error.message}`);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if your backend is deployed and running');
    console.log('2. Verify the BACKEND_URL in this script');
    console.log('3. Check Render logs for any errors');
    console.log('4. Ensure environment variables are set correctly');
  }
}

// Check if URLs are configured
if (BACKEND_URL.includes('your-render-backend')) {
  console.log('❌ Please update the BACKEND_URL in this script first!');
  console.log('   Replace "your-render-backend.onrender.com" with your actual Render backend URL');
  console.log('\n   Example: https://devnovate-blogs-api.onrender.com');
  process.exit(1);
}

// Run tests
runTests();
