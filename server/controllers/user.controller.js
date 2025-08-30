const User = require('../models/user.model');
const Blog = require('../models/blog.model');

/**
 * @desc    Get user profile
 * @route   GET /api/users/:id
 * @access  Public
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's published blogs
    const blogs = await Blog.find({
      author: user._id,
      status: 'published'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user,
        blogs
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    // Fields to update
    const fieldsToUpdate = {
      name: req.body.name,
      bio: req.body.bio
    };

    // If profile picture is provided
    if (req.body.profilePicture) {
      fieldsToUpdate.profilePicture = req.body.profilePicture;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's blogs
 * @route   GET /api/users/blogs
 * @access  Private
 */
exports.getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).sort({
      createdAt: -1
    });

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
 * @desc    Get user's published blogs
 * @route   GET /api/users/:id/blogs
 * @access  Public
 */
exports.getUserPublishedBlogs = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const blogs = await Blog.find({
      author: user._id,
      status: 'published'
    }).sort({ createdAt: -1 });

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
 * @desc    Get user's liked blogs
 * @route   GET /api/users/blogs/liked
 * @access  Private
 */
exports.getLikedBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({
      likes: req.user.id,
      status: 'published'
    })
      .populate('author', 'name profilePicture')
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