const express = require('express');
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  getComments,
  getTrendingBlogs
} = require('../controllers/blog.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/:id', getBlog);
router.get('/:id/comments', getComments);

// Protected routes
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.put('/:id/like', protect, likeBlog);
router.post('/:id/comments', protect, addComment);

module.exports = router;