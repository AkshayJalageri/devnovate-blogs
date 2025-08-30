const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, role) => {
  // Convert days to seconds for JWT expiration
  const defaultExpiration = 30 * 24 * 60 * 60; // 30 days in seconds
  const expiresIn = process.env.JWT_EXPIRE || defaultExpiration;
  
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: expiresIn
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };