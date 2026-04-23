const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0,
    default: null
  },
  category: {
    type: String,
    required: true,
    enum: ['formal', 'jeans', 'track']
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  sizes: [{
    type: String,
    required: true
  }],
  colors: [{
    type: String,
    required: true
  }],
  material: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
