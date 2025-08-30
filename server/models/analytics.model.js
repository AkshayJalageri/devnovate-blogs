const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    viewsHistory: [{
      date: {
        type: Date,
        default: Date.now
      },
      count: {
        type: Number,
        default: 0
      }
    }],
    referrers: [{
      source: String,
      count: Number
    }],
    devices: [{
      type: String,
      count: Number
    }]
  },
  { timestamps: true }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;