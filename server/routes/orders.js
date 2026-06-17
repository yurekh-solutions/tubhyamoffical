const express = require('express');
const router = express.Router();
const axios = require('axios');

const INVENTORY_API = process.env.INVENTORY_API_URL || 'http://localhost:3001';

// POST /api/orders - Create a new order & sync with inventory
router.post('/', async (req, res) => {
  try {
    const { items, customerInfo, paymentId, orderId, amount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items are required' });
    }

    const generatedOrderId = orderId || `ORD_${Date.now()}`;

    // Map items to inventory format
    const inventoryItems = items.map(item => ({
      sku: item.sku || '',
      productId: item.productId || item._id || null,
      name: item.name || item.title || '',
      quantity: item.quantity || 1,
      size: item.size || null,
      color: item.color || null,
      price: item.price || item.sellingPrice || 0,
    }));

    // Forward to inventory app — deducts stock + generates invoice
    let inventoryResult = null;
    try {
      const { data } = await axios.post(
        `${INVENTORY_API}/api/storefront/order`,
        {
          items: inventoryItems,
          customerPhone: customerInfo?.phone || customerInfo?.whatsappNumber || '',
          customerName: customerInfo?.name || 'Online Customer',
          customerState: customerInfo?.state || '',
          customerCity: customerInfo?.city || '',
          customerAddress: customerInfo?.address || '',
          customerPincode: customerInfo?.pincode || '',
          paymentId,
          orderId: generatedOrderId,
          amount,
          paymentMode: 'upi',
        },
        { timeout: 15000 }
      );
      inventoryResult = data;
    } catch (invErr) {
      console.error('Inventory sync failed:', invErr.response?.data || invErr.message);
      // Don't fail the order — stock sync can be retried
    }

    res.json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: generatedOrderId,
        paymentId,
        amount,
        items,
        customerInfo,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
      inventory: inventoryResult,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    // Try fetching invoice from inventory app by order ID
    try {
      const { data } = await axios.get(
        `${INVENTORY_API}/api/storefront/order/${req.params.id}`,
        { timeout: 10000 }
      );
      return res.json({ success: true, ...data });
    } catch (invErr) {
      // Fallback if inventory not available
    }
    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

module.exports = router;
