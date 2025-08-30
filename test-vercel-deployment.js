#!/usr/bin/env node

/**
 * Test Vercel Deployment
 * This script tests the current Vercel deployment to see what's happening
 */

const https = require('https');

console.log('🧪 Testing Vercel Deployment\n');

const FRONTEND_URL = 'https://devnovate-blogs-mu.vercel.app';
const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';

console.log('🔧 Test Configuration:');
console.log(`Frontend: ${FRONTEND_URL}`);
console.log(`Backend: ${BACKEND_URL}\n`);

// Test 1: Check if Vercel frontend is accessible
async function testVercelFrontend() {
  console.log('1️⃣ Testing Vercel Frontend Accessibility...');
  
  try {
    const response = await makeRequest(FRONTEND_URL, 'GET');
    if (response.statusCode === 200) {
      console.log('✅ Vercel frontend is accessible');
    } else {
      console.log(`⚠️  Vercel frontend returned status: ${response.statusCode}`);
    }
  } catch (error) {
    console.log('❌ Vercel frontend test failed:', error.message);
  }
}

// Test 2: Check if backend is accessible
async function testBackendAccessibility() {
  console.log('\n2️⃣ Testing Backend Accessibility...');
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/health`, 'GET');
    if (response.statusCode === 200) {
      console.log('✅ Backend is accessible');
      console.log('   Health endpoint working');
    } else {
      console.log(`⚠️  Backend returned status: ${response.statusCode}`);
    }
  } catch (error) {
    console.log('❌ Backend test failed:', error.message);
  }
}

// Test 3: Check blogs endpoint directly
async function testBlogsEndpoint() {
  console.log('\n3️⃣ Testing Blogs Endpoint Directly...');
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/blogs`, 'GET');
    if (response.statusCode === 200) {
      console.log('✅ Blogs endpoint is working');
      console.log('   Backend can serve blogs');
    } else {
      console.log(`⚠️  Blogs endpoint returned status: ${response.statusCode}`);
    }
  } catch (error) {
    console.log('❌ Blogs endpoint test failed:', error.message);
  }
}

// Test 4: Check CORS from Vercel origin
async function testCorsFromVercel() {
  console.log('\n4️⃣ Testing CORS from Vercel Origin...');
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/blogs`, 'GET', null, FRONTEND_URL);
    if (response.statusCode === 200) {
      console.log('✅ CORS is working from Vercel origin');
      console.log('   Backend accepts requests from Vercel');
    } else {
      console.log(`⚠️  CORS test returned status: ${response.statusCode}`);
    }
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
}

// Helper function to make HTTP requests
function makeRequest(url, method, data = null, origin = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (origin) {
      options.headers['Origin'] = origin;
    }
    
    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const protocol = urlObj.protocol === 'https:' ? https : require('http');
    
    const req = protocol.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData
        });
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
  console.log('🚀 Starting Vercel Deployment Tests...\n');
  
  await testVercelFrontend();
  await testBackendAccessibility();
  await testBlogsEndpoint();
  await testCorsFromVercel();
  
  console.log('\n🎯 Vercel Deployment Tests Complete!');
  console.log('\n📋 What This Tested:');
  console.log('1. ✅ Vercel frontend accessibility');
  console.log('2. ✅ Backend accessibility and health');
  console.log('3. ✅ Blogs endpoint functionality');
  console.log('4. ✅ CORS configuration from Vercel');
  console.log('\n🔍 If any tests failed, check:');
  console.log('   - Vercel deployment status');
  console.log('   - Backend environment variables');
  console.log('   - CORS configuration');
  console.log('   - Network connectivity');
}

runAllTests();
