const express = require('express');
const router = express.Router();
const {
  getPendingBlogs,
  getAllBlogs,
  approveBlog,
  rejectBlog,
  hideBlog,
  deleteBlog,
  getUsers,
  updateUserRole,
  getAdminStats
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes are protected and require admin role
router.use(protect, authorize('admin'));

// Blog management routes
router.get('/blogs', getAllBlogs);
router.get('/blogs/pending', getPendingBlogs);
router.put('/blogs/:id/approve', approveBlog);
router.put('/blogs/:id/reject', rejectBlog);
router.put('/blogs/:id/hide', hideBlog);
router.delete('/blogs/:id', deleteBlog);

// User management routes
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

// Dashboard stats
router.get('/stats', getAdminStats);

module.exports = router;