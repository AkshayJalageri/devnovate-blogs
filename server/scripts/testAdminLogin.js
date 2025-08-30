const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    // Attempt login
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123456'
    });
    
    console.log('Login successful!');
    console.log('Token:', loginResponse.data.token);
    
    // Test accessing admin endpoint with token
    const adminResponse = await axios.get('http://localhost:5000/api/admin/users', {
      headers: {
        Authorization: `Bearer ${loginResponse.data.token}`
      }
    });
    
    console.log('Admin API access successful!');
    console.log(`Retrieved ${adminResponse.data.count} users`);
    console.log('Users:', adminResponse.data.data);
    
  } catch (error) {
    console.error('Error testing admin login:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testAdminLogin();