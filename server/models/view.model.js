const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ip: {
      type: String,
      required: function() {
        return !this.user;
      }
    },
    userAgent: {
      type: String
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    }
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness of views based on blog and either user or IP
viewSchema.index({ blog: 1, user: 1 }, { unique: true, sparse: true });
viewSchema.index({ blog: 1, ip: 1 }, { unique: true, sparse: true });

const View = mongoose.model('View', viewSchema);

module.exports = View;