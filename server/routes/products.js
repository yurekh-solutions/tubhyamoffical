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

  // Prefer the human-readable SKU as the product id. This lets the
  // frontend merge with its curated static catalog (which uses SKUs like
  // 'fp-017', 'tp-002'). Fall back to _id for legacy documents that have
  // no sku field.
  const id = p.sku || p.id || p._id;

  return {
    id,
    sku: p.sku || id,
    mongoId: p._id, // preserve MongoDB _id so frontend can match stale URLs
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

/**
 * Deduplicates products by name, merging images from variants.
 * Handles partial matches: "Product - Pose" merges into "Product".
 * - The first (base) product's details are kept
 * - Images from variant/duplicate products are merged in
 * - Variant products are removed from the list
 */
function deduplicateProducts(products) {
  const seen = new Map();
  for (const product of products) {
    const name = product.name.toLowerCase().trim();
    // Check exact match first
    if (seen.has(name)) {
      mergeImages(seen.get(name), product);
      continue;
    }
    // Check partial match: does this name start with an existing key?
    // e.g. "korean baggy plated formal pants - pose" starts with "korean baggy plated formal pants"
    let merged = false;
    for (const [key, existing] of seen) {
      if (name.startsWith(key) || key.startsWith(name)) {
        mergeImages(existing, product);
        merged = true;
        break;
      }
    }
    if (!merged) {
      seen.set(name, { ...product });
    }
  }
  return Array.from(seen.values());
}

function mergeImages(existing, incoming) {
  const existingUrls = new Set(existing.images);
  for (const img of incoming.images) {
    if (!existingUrls.has(img)) {
      existing.images.push(img);
      existingUrls.add(img);
    }
  }
}

/**
 * Deduplicates raw MongoDB product documents by name (partial match).
 * Used before sorting/slicing to ensure variants are merged early.
 */
function deduplicateRawProducts(products) {
  const seen = new Map();
  for (const product of products) {
    const name = (product.name || '').toLowerCase().trim();
    if (seen.has(name)) {
      const existing = seen.get(name);
      const existingImgs = new Set(existing.images || []);
      for (const img of (product.images || [])) {
        if (!existingImgs.has(img)) {
          existing.images.push(img);
          existingImgs.add(img);
        }
      }
      continue;
    }
    let merged = false;
    for (const [key, existing] of seen) {
      if (name.startsWith(key) || key.startsWith(name)) {
        const existingImgs = new Set(existing.images || []);
        for (const img of (product.images || [])) {
          if (!existingImgs.has(img)) {
            existing.images.push(img);
            existingImgs.add(img);
          }
        }
        merged = true;
        break;
      }
    }
    if (!merged) {
      seen.set(name, { ...product });
    }
  }
  return Array.from(seen.values());
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

    const products = deduplicateProducts((Array.isArray(data) ? data : []).map(mapProduct));
    // Stable sort: bestsellers first, then by name for consistent ordering on every refresh
    products.sort((a, b) => {
      if (a.isBestSeller !== b.isBestSeller) return b.isBestSeller ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
    res.json({ success: true, products, totalCount: products.length });
  } catch (error) {
    console.error('Products proxy error:', error.message);
    res.json({ success: true, products: [], totalCount: 0 });
  }
});

/**
 * Fisher-Yates shuffle for random product variety on each page load.
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// GET /api/products/featured/bestsellers
router.get('/featured/bestsellers', async (req, res) => {
  try {
    const { data } = await axios.get(`${INVENTORY_API}/api/products`, { timeout: 10000 });
    const rawProducts = Array.isArray(data) ? data : [];
    const deduped = deduplicateRawProducts(rawProducts);
    const products = shuffleArray(
      deduped.filter(p => (p.currentStock || 0) > 30)
    )
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
    const rawProducts = Array.isArray(data) ? data : [];
    const deduped = deduplicateRawProducts(rawProducts);
    const products = shuffleArray(deduped)
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
    const products = deduplicateProducts((Array.isArray(data) ? data : []).map(mapProduct));
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
