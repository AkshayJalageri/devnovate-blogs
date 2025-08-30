const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  getUserBlogs,
  getUserPublishedBlogs,
  getLikedBlogs
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.get('/:id', getUserProfile);
router.get('/:id/blogs', getUserPublishedBlogs);

// Protected routes
router.put('/profile', protect, updateProfile);
router.get('/blogs/me', protect, getUserBlogs);
router.get('/blogs/liked', protect, getLikedBlogs);

module.exports = router;