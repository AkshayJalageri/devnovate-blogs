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

// Protected routes (must come before /:id routes to avoid conflicts)
router.put('/profile', protect, updateProfile);
router.get('/blogs/me', protect, getUserBlogs);
router.get('/blogs/liked', protect, getLikedBlogs);

// Public routes (must come after specific routes)
router.get('/:id', getUserProfile);
router.get('/:id/blogs', getUserPublishedBlogs);

module.exports = router;