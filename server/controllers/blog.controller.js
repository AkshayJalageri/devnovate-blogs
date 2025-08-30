const Blog = require('../models/blog.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const Analytics = require('../models/analytics.model');
const View = require('../models/view.model');
const { sendEmail, emailTemplates } = require('../utils/email');

/**
 * @desc    Create a new blog
 * @route   POST /api/blogs
 * @access  Private
 */
exports.createBlog = async (req, res, next) => {
  try {
    // Add author to req.body
    req.body.author = req.user.id;

    // Create blog
    const blog = await Blog.create(req.body);

    // Create analytics entry for the blog
    await Analytics.create({
      blog: blog._id
    });

    // Send email notification
    try {
      const user = await User.findById(req.user.id);
      await sendEmail({
        email: user.email,
        ...emailTemplates.blogSubmitted(user.name, blog.title)
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Blog created successfully and pending approval',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all published blogs
 * @route   GET /api/blogs
 * @access  Public
 */
exports.getBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Blog.countDocuments({ status: 'published' });

    // Build query
    let query = Blog.find({ status: 'published' })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Search functionality
    if (req.query.search) {
      query = Blog.find(
        { 
          status: 'published',
          $text: { $search: req.query.search } 
        },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .populate('author', 'name profilePicture')
        .skip(startIndex)
        .limit(limit);
    }

    // Filter by tag
    if (req.query.tag) {
      query = Blog.find({ 
        status: 'published',
        tags: { $in: [req.query.tag] } 
      })
        .populate('author', 'name profilePicture')
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);
    }

    // Filter by author
    if (req.query.author) {
      query = Blog.find({ 
        status: 'published',
        author: req.query.author 
      })
        .populate('author', 'name profilePicture')
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);
    }

    // Execute query
    const blogs = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get trending blogs
 * @route   GET /api/blogs/trending
 * @access  Public
 */
exports.getTrendingBlogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    // Get blogs with most likes and comments in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const blogs = await Blog.find({
      status: 'published',
      createdAt: { $gte: sevenDaysAgo }
    })
      .populate('author', 'name profilePicture')
      .sort({ likes: -1, views: -1 })
      .limit(limit);

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
 * @desc    Get single blog
 * @route   GET /api/blogs/:id
 * @access  Public
 */
exports.getBlog = async (req, res, next) => {
  try {
    // Find the blog by ID
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if blog is published or user is author or admin
    if (blog.status !== 'published') {
      if (!req.user || (req.user.id !== blog.author.toString() && req.user.role !== 'admin')) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this blog'
        });
      }
    }
    
    // Populate author information
    try {
      await Blog.populate(blog, {
        path: 'author',
        select: 'name email bio profilePicture'
      });
    } catch (error) {
      console.error('Error populating author:', error.message);
      // Continue without population if there's an error
    }
    
    // Track genuine views
    
    // Get user ID if authenticated
    const userId = req.user ? req.user.id : null;
    
    // Get IP address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Get user agent
    const userAgent = req.headers['user-agent'];
    
    // Set expiration time (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Check if this user/IP has already viewed this blog in the last 24 hours
    let viewExists;
    if (userId) {
      viewExists = await View.findOne({ blog: blog._id, user: userId });
    } else {
      viewExists = await View.findOne({ blog: blog._id, ip });
    }
    
    // Only count as a new view if no existing view record is found
    if (!viewExists) {
      // Create a new view record
      try {
        await View.create({
          blog: blog._id,
          user: userId,
          ip,
          userAgent,
          expiresAt
        });
        
        // Update blog views
        blog.views += 1;
        await blog.save();

        // Update analytics
        const analytics = await Analytics.findOne({ blog: blog._id });
        if (analytics) {
          analytics.views += 1;
          analytics.viewsHistory.push({
            date: Date.now(),
            count: 1
          });
          await analytics.save();
        } else {
          await Analytics.create({
            blog: blog._id,
            views: 1
          });
        }
      } catch (error) {
        console.error('Error tracking view:', error);
        // Continue even if view tracking fails
      }
    }
    
    // Get comments separately to avoid population errors
    const comments = await Comment.find({ blog: blog._id })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 });
    
    // Return the blog with comments
    res.status(200).json({
      success: true,
      data: {
        ...blog.toObject(),
        comments
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update blog
 * @route   PUT /api/blogs/:id
 * @access  Private
 */
exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Make sure user is blog owner or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }

    // If user is not admin and blog is published, they can only update certain fields
    if (req.user.role !== 'admin' && blog.status === 'published') {
      const allowedUpdates = ['title', 'content', 'excerpt', 'coverImage', 'tags'];
      const requestedUpdates = Object.keys(req.body);
      const isValidOperation = requestedUpdates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({
          success: false,
          message: 'Cannot update status of a published blog'
        });
      }

      // Set status back to pending if content is updated
      if (req.body.content || req.body.title) {
        req.body.status = 'pending';
      }
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:id
 * @access  Private
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

    // Make sure user is blog owner or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }

    // Delete blog
    await blog.remove();

    // Delete associated comments
    await Comment.deleteMany({ blog: req.params.id });

    // Delete analytics
    await Analytics.deleteOne({ blog: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like/Unlike blog
 * @route   PUT /api/blogs/:id/like
 * @access  Private
 */
exports.likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if blog is already liked
    const isLiked = blog.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike
      blog.likes = blog.likes.filter(
        like => like.toString() !== req.user.id
      );
    } else {
      // Like
      blog.likes.push(req.user.id);
    }

    await blog.save();

    // Update analytics
    const analytics = await Analytics.findOne({ blog: blog._id });
    if (analytics) {
      analytics.likes = blog.likes.length;
      await analytics.save();
    }

    res.status(200).json({
      success: true,
      message: isLiked ? 'Blog unliked' : 'Blog liked',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add comment to blog
 * @route   POST /api/blogs/:id/comments
 * @access  Private
 */
exports.addComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Create comment
    const comment = await Comment.create({
      content: req.body.content,
      blog: req.params.id,
      user: req.user.id,
      parent: req.body.parent || null
    });

    // Update analytics
    const analytics = await Analytics.findOne({ blog: blog._id });
    if (analytics) {
      analytics.comments += 1;
      await analytics.save();
    }

    // Send email notification to blog author if commenter is not the author
    if (blog.author.toString() !== req.user.id) {
      try {
        const author = await User.findById(blog.author);
        const commenter = await User.findById(req.user.id);
        const blogUrl = `${process.env.CLIENT_URL}/blogs/${blog._id}`;

        await sendEmail({
          email: author.email,
          ...emailTemplates.newComment(author.name, blog.title, commenter.name, blogUrl)
        });
      } catch (error) {
        console.error('Email sending failed:', error);
        // Continue even if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comments for a blog
 * @route   GET /api/blogs/:id/comments
 * @access  Public
 */
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ blog: req.params.id })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};