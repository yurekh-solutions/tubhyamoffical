// Simple Express server to handle SMS API calls
// Using MSG91 - Free SMS for testing in India

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// SMS endpoint
app.post('/api/send-sms', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    const apiKey = process.env.VITE_SMS_API_KEY;

    console.log('Received SMS request for:', phoneNumber);
    console.log('API Key exists:', !!apiKey);

    if (!apiKey) {
      console.log('SMS API not configured');
      return res.json({
        success: false,
        message: 'SMS API not configured',
      });
    }

    // Extract OTP from message
    const otpMatch = message.match(/\d{6}/);
    const otp = otpMatch ? otpMatch[0] : '123456';

    console.log('Sending OTP:', otp, 'to:', phoneNumber);

    // Use MSG91 SMS API (Free for testing)
    const url = `https://api.msg91.com/apiv5/flow/?route=4&recipients=${phoneNumber}&authkey=${apiKey}&message=${encodeURIComponent(message)}`;
    
    const response = await fetch(url, {
      method: 'GET',
    });

    const data = await response.json();
    console.log('MSG91 Response:', JSON.stringify(data, null, 2));
    
    if (data.type === 'success' || (data.type && data.type.includes('success'))) {
      console.log('SMS sent successfully!');
      res.json({
        success: true,
        message: 'SMS sent successfully',
        data: data,
      });
    } else {
      console.log('SMS failed:', data.message || data.type);
      res.json({
        success: false,
        message: data.message || 'Failed to send SMS',
        error: data,
      });
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`SMS API server running on http://localhost:${PORT}`);
});
