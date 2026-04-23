const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { body, validationResult } = require('express-validator');

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TBH-${timestamp}${random}`;
};

// POST create new order
router.post('/', [
  body('customer.name').trim().notEmpty().withMessage('Name is required'),
  body('customer.phone').trim().notEmpty().withMessage('Phone is required'),
  body('customer.address').trim().notEmpty().withMessage('Address is required'),
  body('customer.city').trim().notEmpty().withMessage('City is required'),
  body('customer.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item required'),
  body('totalAmount').isNumeric().withMessage('Total amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { customer, items, totalAmount, paymentMethod = 'cod', notes = '' } = req.body;

    const order = new Order({
      orderId: generateOrderId(),
      customer,
      items,
      totalAmount,
      paymentMethod,
      notes,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// GET order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).lean();
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

// GET track order (public endpoint, minimal info)
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .select('orderId status trackingNumber totalAmount items.name items.image items.quantity items.size items.color customer.name createdAt updatedAt')
      .lean();
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ success: false, message: 'Failed to track order' });
  }
});

// PUT update order status (admin)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    
    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      updateData,
      { new: true }
    ).lean();
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
});

// GET all orders (admin - with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    
    let query = {};
    if (status) query.status = status;
    
    const [orders, totalCount] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      orders,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

module.exports = router;
