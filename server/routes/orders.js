const express = require('express');
const router = express.Router();
const axios = require('axios');
const shiprocket = require('../services/ShiprocketService');

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
        shippingStatus: 'pending',
        createdAt: new Date().toISOString(),
      },
      inventory: inventoryResult,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// POST /api/orders/:id/ship - Create shipment via Shiprocket
router.post('/:id/ship', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { customerInfo, items, amount, paymentMode } = req.body;

    if (!customerInfo || !items) {
      return res.status(400).json({ success: false, message: 'Order details required' });
    }

    const result = await shiprocket.createShipment({
      orderId,
      customerName: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: customerInfo.address,
      city: customerInfo.city,
      state: customerInfo.state,
      pincode: customerInfo.pincode,
      items,
      amount,
      paymentMode: paymentMode || 'upi',
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Shipment created successfully',
        shipment_id: result.shipment_id,
        awb_code: result.awb_code,
      });
    } else {
      res.status(400).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Shipment creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create shipment' });
  }
});

// GET /api/orders/:id/track - Track shipment
router.get('/:id/track', async (req, res) => {
  try {
    const { awb } = req.query;
    
    if (!awb) {
      return res.status(400).json({ success: false, message: 'AWB code required' });
    }

    const result = await shiprocket.trackShipment(awb);
    res.json(result);
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ success: false, message: 'Failed to track shipment' });
  }
});

// GET /api/orders/couriers - Get available couriers
router.get('/couriers/available', async (req, res) => {
  try {
    const { pincode, weight } = req.query;
    
    if (!pincode) {
      return res.status(400).json({ success: false, message: 'Pincode required' });
    }

    const result = await shiprocket.getAvailableCouriers(pincode, parseFloat(weight) || 0.5);
    res.json(result);
  } catch (error) {
    console.error('Couriers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch couriers' });
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
