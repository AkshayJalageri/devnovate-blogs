const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt'],
      maxlength: [200, 'Excerpt cannot be more than 200 characters']
    },
    coverImage: {
      type: String,
      default: 'default-cover.jpg'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected', 'hidden'],
      default: 'pending'
    },
    tags: [{
      type: String,
      trim: true
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    views: {
      type: Number,
      default: 0
    },
    readTime: {
      type: Number,
      default: 0
    },
    rejectionReason: {
      type: String
    }
  },
  { timestamps: true }
);

// Create index for search functionality
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Calculate read time before saving
blogSchema.pre('save', function(next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.readTime = Math.ceil(wordCount / wordsPerMinute);
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;