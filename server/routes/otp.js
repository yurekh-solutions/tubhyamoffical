const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/otp/send - Send OTP via SMS (server-side only, no secrets in frontend)
router.post('/send', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and message are required'
      });
    }

    // Validate phone number (Indian 10-digit)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number'
      });
    }

    // Try sending via Inventory App SMS proxy
    const inventoryApiUrl = process.env.INVENTORY_API_URL || 'http://localhost:3001';
    
    try {
      const smsResponse = await axios.post(
        `${inventoryApiUrl}/api/send-sms`,
        { phoneNumber: cleanPhone, message },
        { timeout: 10000 }
      );

      if (smsResponse.data?.success) {
        return res.json({
          success: true,
          message: 'OTP sent via SMS'
        });
      }
    } catch (smsError) {
      console.warn('SMS proxy unavailable, falling back to demo mode:', smsError.message);
    }

    // Fallback: demo mode (OTP generated but not sent via SMS)
    res.json({
      success: true,
      message: 'Demo mode: SMS would be sent in production',
      demo: true
    });

  } catch (error) {
    console.error('OTP send error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

module.exports = router;
