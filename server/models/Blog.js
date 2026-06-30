const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: 300
  },
  category: {
    type: String,
    default: ''
  },
  keywords: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  readTime: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['planned', 'generating', 'draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  },
  scheduledPublishDate: {
    type: Date,
    default: null
  },
  publishedAt: {
    type: Date,
    default: null
  },
  trendKeyword: {
    type: String,
    default: ''
  },
  trendSource: {
    type: String,
    default: ''
  },
  // ── Campaign fields ──
  campaignId: {
    type: String,
    default: ''
  },
  dayIndex: {
    type: Number,
    default: 0
  },
  autoPublish: {
    type: Boolean,
    default: true
  },
  generationMode: {
    type: String,
    default: 'jit'
  },
  metaTitle: {
    type: String,
    default: ''
  },
  metaDescription: {
    type: String,
    default: ''
  },
  focusKeyword: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  inlineImages: [{
    url: String,
    altText: String,
    role: String
  }],
  held: {
    type: Boolean,
    default: false
  },
  generationStatus: {
    type: String,
    enum: ['planned', 'generating', 'ready', 'failed'],
    default: 'planned'
  },
  errorMessage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Auto-generate slug from title with random suffix to prevent collisions
blogSchema.pre('save', async function(next) {
  if (this.isModified('title') && !this.slug) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    this.slug = `${baseSlug}-${randomSuffix}`;
  }
  next();
});

// Indexes for efficient queries
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ slug: 1 });
blogSchema.index({ scheduledPublishDate: 1, status: 1 });
blogSchema.index({ campaignId: 1, dayIndex: 1 });

module.exports = mongoose.model('Blog', blogSchema);
