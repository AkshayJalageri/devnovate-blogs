const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// Special route to promote first user to admin (temporary) - NO AUTH REQUIRED
router.post('/promote-first-admin', async (req, res) => {
  try {
    const User = require('../models/user.model');
    
    // Find the first user with email admin@devnovate.com
    const user = await User.findOne({ email: 'admin@devnovate.com' });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }
    
    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User promoted to admin successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error promoting user to admin',
      error: error.message
    });
  }
});

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;