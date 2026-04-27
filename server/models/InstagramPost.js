const mongoose = require('mongoose');

const instagramPostSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    unique: true,
    index: true
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
    enum: ['IMAGE', 'VIDEO', 'REEL', 'CAROUSEL_ALBUM'],
    default: 'IMAGE'
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  likesCount: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  syncedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient sorting by timestamp
instagramPostSchema.index({ timestamp: -1 });

module.exports = mongoose.model('InstagramPost', instagramPostSchema);
