const Blog = require('../models/blog.model');
const User = require('../models/user.model');
const { sendEmail, emailTemplates } = require('../utils/email');

/**
 * @desc    Get all blogs
 * @route   GET /api/admin/blogs
 * @access  Private/Admin
 */
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a blog
 * @route   DELETE /api/admin/blogs/:id
 * @access  Private/Admin
 */
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Get author details before deleting the blog
    const author = await User.findById(blog.author);

    // Delete the blog
    await blog.deleteOne();

    // Send email notification to author
    try {
      await sendEmail({
        email: author.email,
        subject: 'Your blog has been deleted',
        template: emailTemplates.blogDeleted,
        data: {
          name: author.name,
          blogTitle: blog.title
        }
      });
    } catch (emailError) {
      console.log('Email notification failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all pending blogs
 * @route   GET /api/admin/blogs/pending
 * @access  Private/Admin
 */
exports.getPendingBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'pending' })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve a blog
 * @route   PUT /api/admin/blogs/:id/approve
 * @access  Private/Admin
 */
exports.approveBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Update blog status
    blog.status = 'published';
    await blog.save();

    // Send email notification to author
    try {
      const author = await User.findById(blog.author);
      const blogUrl = `${process.env.CLIENT_URL}/blogs/${blog._id}`;

      await sendEmail({
        email: author.email,
        ...emailTemplates.blogApproved(author.name, blog.title, blogUrl)
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      // Continue even if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Blog approved successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject a blog
 * @route   PUT /api/admin/blogs/:id/reject
 * @access  Private/Admin
 */
exports.rejectBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Update blog status
    blog.status = 'rejected';
    blog.rejectionReason = req.body.reason || 'Does not meet our content guidelines';
    await blog.save();

    // Send email notification to author
    try {
      const author = await User.findById(blog.author);

      await sendEmail({
        email: author.email,
        ...emailTemplates.blogRejected(author.name, blog.title, blog.rejectionReason)
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      // Continue even if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Blog rejected successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Hide a published blog
 * @route   PUT /api/admin/blogs/:id/hide
 * @access  Private/Admin
 */
exports.hideBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Update blog status
    blog.status = 'hidden';
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog hidden successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user role
    user.role = req.body.role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const pendingBlogs = await Blog.countDocuments({ status: 'pending' });
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const rejectedBlogs = await Blog.countDocuments({ status: 'rejected' });

    // Get recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent blogs
    const recentBlogs = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get top authors
    const topAuthors = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Populate author details
    for (let i = 0; i < topAuthors.length; i++) {
      const author = await User.findById(topAuthors[i]._id).select('name email');
      topAuthors[i].author = author;
    }

    // Calculate total views (if analytics model exists)
    let totalViews = 0;
    try {
      const Analytics = require('../models/analytics.model');
      const viewsData = await Analytics.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]);
      totalViews = viewsData.length > 0 ? viewsData[0].total : 0;
    } catch (err) {
      console.log('Analytics model not available or error calculating views');
    }

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBlogs,
        pendingBlogs,
        publishedBlogs,
        rejectedBlogs,
        recentBlogs,
        recentUsers,
        topAuthors,
        totalViews
      }
    });
  } catch (error) {
    next(error);
  }
};