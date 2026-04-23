const mongoose = require('mongoose');

const instagramPostSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    unique: true
  },
  caption: {
    type: String,
    default: ''
  },
  mediaUrl: {
    type: String,
    required: true
  },
  permalink: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM', 'REEL'],
    default: 'IMAGE'
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    required: true
  },
  likesCount: {
    type: Number,
    default: 0
  },
  syncedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for sorting by timestamp
instagramPostSchema.index({ timestamp: -1 });

module.exports = mongoose.model('InstagramPost', instagramPostSchema);
