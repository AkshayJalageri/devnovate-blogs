/**
 * Format date to a readable string
 * @param {string|Date} dateString - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const mergedOptions = { ...defaultOptions, ...options };
  return new Date(dateString).toLocaleDateString(undefined, mergedOptions);
};

/**
 * Calculate read time for a blog post
 * @param {string} content - Blog content
 * @returns {number} Read time in minutes
 */
export const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime < 1 ? 1 : readTime;
};

/**
 * Truncate text to a specific length and add ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Check if a token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Get the expiration time from the token (assuming JWT)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Check if the token has expired
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's an error, assume the token is expired
  }
};

/**
 * Generate a random avatar based on user's name
 * @param {string} name - User's name
 * @returns {string} Avatar URL
 */
export const generateAvatar = (name) => {
  // This is a simple implementation using DiceBear Avatars API
  const formattedName = encodeURIComponent(name.trim());
  return `https://avatars.dicebear.com/api/initials/${formattedName}.svg`;
};

/**
 * Extract tags from text (words starting with #)
 * @param {string} text - Text to extract tags from
 * @returns {string[]} Array of tags
 */
export const extractTags = (text) => {
  if (!text) return [];
  
  const matches = text.match(/#\w+/g);
  if (!matches) return [];
  
  return matches.map(tag => tag.substring(1).toLowerCase());
};

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get browser storage item with expiry check
 * @param {string} key - Storage key
 * @returns {any} Stored value or null if expired/not found
 */
export const getStorageWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  
  // If the item doesn't exist, return null
  if (!itemStr) return null;
  
  const item = JSON.parse(itemStr);
  const now = new Date();
  
  // Compare the expiry time of the item with the current time
  if (item.expiry && now.getTime() > item.expiry) {
    // If the item is expired, remove it from storage and return null
    localStorage.removeItem(key);
    return null;
  }
  
  return item.value;
};

/**
 * Set browser storage item with expiry
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {number} ttl - Time to live in milliseconds
 */
export const setStorageWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    value,
    expiry: ttl ? now.getTime() + ttl : null,
  };
  
  localStorage.setItem(key, JSON.stringify(item));
};