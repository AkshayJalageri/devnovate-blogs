
#!/usr/bin/env node

/**
 * Test Registration Script for Devnovate Blogs
 * Run this to test the registration endpoint directly
 */

const https = require('https');

console.log('🧪 Testing Registration Endpoint\n');

const BACKEND_URL = 'https://devnovate-blogs-api.onrender.com';
const TEST_USER = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'testpassword123'
};

console.log('🔧 Test Configuration:');
console.log(`Backend: ${BACKEND_URL}`);
console.log(`Test User: ${JSON.stringify(TEST_USER, null, 2)}\n`);

function testRegistration() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(TEST_USER);
    
    const options = {
      hostname: new URL(BACKEND_URL).hostname,
      port: 443,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Origin': 'https://devnovate-blogs-mu.vercel.app'
      }
    };
    
    console.log('📡 Testing registration endpoint...');
    console.log(`URL: ${BACKEND_URL}/api/auth/register`);
    console.log(`Method: ${options.method}`);
    console.log(`Headers: ${JSON.stringify(options.headers, null, 2)}`);
    console.log(`Body: ${postData}\n`);
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 Response Status: ${res.statusCode}`);
        console.log(`📊 Response Headers:`, res.headers);
        
        try {
          const response = JSON.parse(data);
          console.log('✅ Registration response:');
          console.log(JSON.stringify(response, null, 2));
          
          if (res.statusCode === 201) {
            console.log('🎉 Registration successful!');
          } else {
            console.log('⚠️ Registration failed with status:', res.statusCode);
          }
          
          resolve(response);
        } catch (error) {
          console.log('⚠️ Invalid JSON response:');
          console.log('Raw response:', data);
          resolve({ status: 'invalid_json', data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Registration test failed:');
      console.log(`Error: ${error.message}`);
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

// Test login after registration
function testLogin() {
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    const options = {
      hostname: new URL(BACKEND_URL).hostname,
      port: 443,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData),
        'Origin': 'https://devnovate-blogs-mu.vercel.app'
      }
    };
    
    console.log('\n🔑 Testing login endpoint...');
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 Login Response Status: ${res.statusCode}`);
        
        try {
          const response = JSON.parse(data);
          console.log('✅ Login response:');
          console.log(JSON.stringify(response, null, 2));
          
          if (res.statusCode === 200) {
            console.log('🎉 Login successful!');
          } else {
            console.log('⚠️ Login failed with status:', res.statusCode);
          }
          
          resolve(response);
        } catch (error) {
          console.log('⚠️ Invalid JSON response from login:');
          console.log('Raw response:', data);
          resolve({ status: 'invalid_json', data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Login test failed:');
      console.log(`Error: ${error.message}`);
      reject(error);
    });
    
    req.write(loginData);
    req.end();
  });
}

// Main test function
async function runTests() {
  try {
    console.log('🚀 Starting registration tests...\n');
    
    // Test 1: Registration
    await testRegistration();
    
    // Test 2: Login (if registration was successful)
    await testLogin();
    
    console.log('\n🎯 Test Summary:');
    console.log('1. ✅ Registration endpoint tested');
    console.log('2. ✅ Login endpoint tested');
    
  } catch (error) {
    console.log('\n❌ Tests failed:');
    console.log(`Error: ${error.message}`);
  }
}

// Run tests
runTests();
