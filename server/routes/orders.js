const express = require('express');
const router = express.Router();

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const { items, customerInfo, paymentId, orderId, amount } = req.body;

    // For now, just acknowledge the order
    res.json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: orderId || `ORD_${Date.now()}`,
        paymentId,
        amount,
        items,
        customerInfo,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

module.exports = router;
