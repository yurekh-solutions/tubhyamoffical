const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products with pagination, filtering, search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    
    const { category, search, sortBy, minPrice, maxPrice } = req.query;
    
    // Build query
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'price-asc':
        sort = { price: 1 };
        break;
      case 'price-desc':
        sort = { price: -1 };
        break;
      case 'name-asc':
        sort = { name: 1 };
        break;
      default:
        sort = { isBestSeller: -1, isNew: -1, createdAt: -1 };
    }
    
    // Execute query
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      products,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: skip + products.length < totalCount
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// GET bestsellers - MUST be before /:id route
router.get('/featured/bestsellers', async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true })
      .limit(8)
      .lean();
    
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bestsellers' });
  }
});

// GET new arrivals - MUST be before /:id route
router.get('/featured/new-arrivals', async (req, res) => {
  try {
    const products = await Product.find({ isNew: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch new arrivals' });
  }
});

// GET products by category - MUST be before /:id route
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    
    const products = await Product.find({ category })
      .sort({ isBestSeller: -1, isNew: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const totalCount = await Product.countDocuments({ category });
    
    res.json({
      success: true,
      products,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// GET single product by ID - MUST be last
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).lean();
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

module.exports = router;
