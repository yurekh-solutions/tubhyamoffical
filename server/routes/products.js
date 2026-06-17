const express = require('express');
const router = express.Router();
const axios = require('axios');

const INVENTORY_API = process.env.INVENTORY_API_URL || 'http://localhost:3001';

/**
 * Maps an inventory-app Product document into the shape the
 * frontend expects (matches src/data/products.ts Product type).
 */
function mapProduct(p) {
  const imageBase = INVENTORY_API;
  const images = (p.images || []).map(img =>
    img.startsWith('http') ? img : `${imageBase}${img}`
  );

  return {
    id: p._id || p.id,
    sku: p.sku,
    name: p.name,
    price: p.sellingPrice || p.mrp || 0,
    sellingPrice: p.sellingPrice || 0,
    costPrice: p.costPrice || 0,
    mrp: p.mrp || p.sellingPrice || 0,
    category: p.category,
    description: p.description || '',
    images,
    image: images[0] || '',
    sizes: (p.sizes || []).map(s => s.size || s),
    colors: (p.colors || []).map(c => c.color || c),
    currentStock: p.currentStock || 0,
    status: p.status || 'in-stock',
    inStock: (p.currentStock || 0) > 0,
    isNew: false,
    isBestSeller: (p.currentStock || 0) > 30,
    isFeatured: (p.currentStock || 0) > 20,
    rating: 4.5,
    reviews: 0,
    hsn: p.hsn || '',
    gstRate: p.gstRate || 18,
    unit: p.unit || 'pcs',
  };
}

// GET /api/products - Get all products (proxied from inventory app)
router.get('/', async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (status) params.set('status', status);

    const { data } = await axios.get(
      `${INVENTORY_API}/api/products?${params.toString()}`,
      { timeout: 10000 }
    );

    const products = (Array.isArray(data) ? data : []).map(mapProduct);
    res.json({ success: true, products, totalCount: products.length });
  } catch (error) {
    console.error('Products proxy error:', error.message);
    res.json({ success: true, products: [], totalCount: 0 });
  }
});

// GET /api/products/featured/bestsellers
router.get('/featured/bestsellers', async (req, res) => {
  try {
    const { data } = await axios.get(`${INVENTORY_API}/api/products`, { timeout: 10000 });
    const products = (Array.isArray(data) ? data : [])
      .filter(p => (p.currentStock || 0) > 30)
      .slice(0, 8)
      .map(mapProduct);
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: true, products: [] });
  }
});

// GET /api/products/featured/new-arrivals
router.get('/featured/new-arrivals', async (req, res) => {
  try {
    const { data } = await axios.get(`${INVENTORY_API}/api/products`, { timeout: 10000 });
    // Sort by createdAt descending, take top 8
    const products = (Array.isArray(data) ? data : [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8)
      .map(mapProduct);
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: true, products: [] });
  }
});

// GET /api/products/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const { data } = await axios.get(
      `${INVENTORY_API}/api/products?category=${req.params.category}`,
      { timeout: 10000 }
    );
    const products = (Array.isArray(data) ? data : []).map(mapProduct);
    res.json({ success: true, products, totalCount: products.length });
  } catch (error) {
    res.json({ success: true, products: [], totalCount: 0 });
  }
});

// GET /api/products/stock/:sku - Live stock check
router.get('/stock/:sku', async (req, res) => {
  try {
    const { data } = await axios.get(
      `${INVENTORY_API}/api/storefront/stock/${req.params.sku}`,
      { timeout: 8000 }
    );
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { data } = await axios.get(
      `${INVENTORY_API}/api/products/${req.params.id}`,
      { timeout: 8000 }
    );
    res.json({ success: true, product: mapProduct(data) });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

module.exports = router;
