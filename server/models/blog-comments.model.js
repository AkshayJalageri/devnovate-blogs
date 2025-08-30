const mongoose = require('mongoose');

const blogCommentsSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },
  { timestamps: true }
);

const BlogComments = mongoose.model('BlogComments', blogCommentsSchema);

module.exports = BlogComments;