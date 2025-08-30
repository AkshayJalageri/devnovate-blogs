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

// All other routes are protected and require admin role
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