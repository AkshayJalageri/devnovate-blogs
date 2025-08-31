import axios from 'axios';

// Get API URL from environment variables with fallbacks
const getApiUrl = () => {
  // Force production URL for any non-localhost environment
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://devnovate-blogs-api.onrender.com/api';
  }
  
  // Check for Vercel environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check for production environment
  if (import.meta.env.PROD) {
    return 'https://devnovate-blogs-api.onrender.com/api';
  }
  
  // Development fallback
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000 // 10 second timeout
});

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized) - user needs to login
    if (error.response && error.response.status === 401) {
      // Don't redirect automatically - let the component handle it
    }
    
    // Handle 403 errors (forbidden)
    if (error.response && error.response.status === 403) {
      // User not authorized for this action
    }
    
    return Promise.reject(error);
  }
);

export default api;
