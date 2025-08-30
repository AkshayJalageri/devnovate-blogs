import axios from 'axios';

// Get API URL from environment variables with fallbacks
const getApiUrl = () => {
  // Check for Vercel environment variable first
  if (import.meta.env.VITE_API_URL) {
    console.log('🔧 Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Check for production environment
  if (import.meta.env.PROD) {
    // Default to Render backend for production
    const productionUrl = 'https://devnovate-blogs-api.onrender.com/api';
    console.log('🔧 Using production URL:', productionUrl);
    return productionUrl;
  }
  
  // Development fallback
  const devUrl = 'http://localhost:5000/api';
  console.log('🔧 Using development URL:', devUrl);
  return devUrl;
};

const API_URL = getApiUrl();

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  finalApiUrl: API_URL,
  currentOrigin: window.location.origin
});

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000 // 10 second timeout
});

// Add a request interceptor to log all requests
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullUrl: config.baseURL + config.url,
      origin: window.location.origin,
      withCredentials: config.withCredentials,
      cookies: document.cookie || 'None',
      cookieCount: document.cookie.split(';').filter(c => c.trim()).length
    });
    
    // No token needed - using cookies for authentication
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
      setCookies: response.headers['set-cookie'] || 'None',
      cookieCount: response.headers['set-cookie'] ? response.headers['set-cookie'].length : 0
    });
    
    // Log cookie details if they're being set
    if (response.headers['set-cookie']) {
      console.log('🍪 Cookies being set:', response.headers['set-cookie']);
    }
    
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      response: error.response?.data,
      headers: error.response?.headers
    });
    
    // Handle 401 errors (unauthorized) - user needs to login
    if (error.response && error.response.status === 401) {
      console.log('🔒 User not authenticated for:', error.config?.url);
      console.log('🔍 Current cookies:', document.cookie || 'None');
      console.log('🔍 Response headers:', error.response?.headers);
      // Don't redirect automatically - let the component handle it
    }
    
    // Handle 403 errors (forbidden)
    if (error.response && error.response.status === 403) {
      console.log('🚫 User not authorized for:', error.config?.url);
    }
    
    return Promise.reject(error);
  }
);

export default api;
