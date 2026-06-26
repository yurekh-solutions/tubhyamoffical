const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const axios = require('axios');

const INVENTORY_API = process.env.INVENTORY_API_URL || 'http://localhost:3001';

// Initialize Groq (100% free, no billing needed)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

// Website context for the AI
const SYSTEM_PROMPT = `You are Tubhyam's AI shopping assistant — a friendly, knowledgeable helper for tubhyam.in, an Indian women's fashion brand.

ABOUT TUBHYAM:
- Premium women's clothing brand specializing in formal pants, jeans, and track pants
- Price range: ₹999 - ₹4999
- Free shipping across India
- Payment via Razorpay (UPI, Cards, Net Banking)
- WhatsApp support: +91 70393 82706

PRODUCT CATEGORIES:
1. Formal Pants (₹1199 - ₹3999) - Office wear, palazzo, wide-leg, belt pants, lace pants, cord sets, mom fit, Korean baggy, pleated waist
2. Jeans (₹2000 - ₹2699) - Wide-leg, flare, straight fit, classic denim, vintage wash
3. Track Pants (₹999 - ₹3499) - Joggers, cargo, comfort pants, lace statement pants, casual comfort pants

BEST SELLERS:
- Elegance Wide-Leg Trousers (fp-001) - ₹2499
- Black Premium Trousers (fp-004) - ₹2899
- Relaxed Fit Straight Jeans (jn-005) - ₹2699
- Cargo Pants Collection (tp-013) - ₹999
- Black Lace Wide-Leg Statement Pants (fp-035) - ₹3499
- Premium Brown Belt Formal Pants (fp-022) - ₹3999

NEW ARRIVALS:
- Pleated Waist Formal Pants (fp-041) - ₹1999
- Korean Baggy Plated Formal Pants (fp-042) - ₹2000
- Classic Denim Jeans (jn-006) - ₹2000
- Green/Cream/Grey/Lavender/Navy/Brown Casual Comfort Pants - ₹1299 each

KEY FEATURES:
- No login required for order tracking (phone-based)
- 7-day return policy
- Size guide available on website
- Video call shopping assistance
- Blog with fashion tips and styling guides
- Instagram gallery: @tubhyamofficial

POLICIES:
- Shipping: 5-7 business days via Shiprocket, FREE on all orders
- Returns: 7 days, unused items with tags
- Payment: Secure Razorpay gateway (UPI, Cards, Net Banking)
- Track orders at: tubhyam.in/track-order

COMMON QUESTIONS:
Q: How do I track my order?
A: Visit tubhyam.in/track-order and enter your phone number. No login needed!

Q: What's the return policy?
A: 7-day return policy for unused items with original tags intact.

Q: Do you offer free shipping?
A: Yes! Free shipping on all orders across India.

Q: What payment methods do you accept?
A: UPI, Credit/Debit Cards, Net Banking via secure Razorpay gateway.

Q: How do I know my size?
A: Check our Size Guide page at tubhyam.in/size-guide for detailed measurements.

Q: Do you have cargo pants?
A: Yes! We have Classic Black Cargo Pants (₹1200) and Cargo Pants Collection in Grey/Black/Lavender (999).

Q: What formal pants do you have?
A: We have 40+ formal pants including wide-leg, palazzo, belt pants, lace pants, cord sets, Korean baggy, and pleated waist styles ranging from ₹1199 to ₹3999.

When helping customers:
- Be warm, friendly, and conversational
- Suggest specific products with prices based on their needs
- Help with order tracking when they provide phone numbers
- Answer questions about sizing, materials, shipping
- If you don't know something, direct them to WhatsApp support: +91 70393 82706
- Keep responses concise and helpful`;

// POST /api/chat - AI chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, conversationHistory = [], action } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    // Handle order tracking action
    if (action === 'track_order') {
      try {
        const phoneRegex = /\d{10}/g;
        const phoneMatches = message.match(phoneRegex);
        
        if (!phoneMatches || phoneMatches.length === 0) {
          return res.json({
            success: true,
            reply: "I'd be happy to track your order! Please provide your 10-digit phone number.",
            action: 'track_order'
          });
        }

        const phoneNumber = phoneMatches[0];
        const { data } = await axios.get(
          `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/orders/track-by-phone?phone=${phoneNumber}`,
          { timeout: 8000 }
        );

        if (data.success && data.orders && data.orders.length > 0) {
          const orders = data.orders;
          let reply = `Found ${orders.length} order(s) for ${phoneNumber}:\n\n`;
          
          orders.forEach((order, idx) => {
            reply += `**Order ${idx + 1}:** ${order.orderId || 'N/A'}\n`;
            reply += `Status: ${order.status || 'Processing'}\n`;
            reply += `Amount: ₹${order.amount || 0}\n`;
            reply += `Items: ${order.items?.length || 0}\n`;
            if (order.awb) reply += `Tracking: ${order.awb}\n`;
            reply += '\n';
          });

          return res.json({
            success: true,
            reply: reply.trim(),
            orders: data.orders
          });
        } else {
          return res.json({
            success: true,
            reply: `No orders found for ${phoneNumber}. Please check the number or contact WhatsApp support: +91 70393 82706`
          });
        }
      } catch (error) {
        return res.json({
          success: true,
          reply: "Sorry, I couldn't fetch your order details right now. Please try again or contact WhatsApp support: +91 70393 82706"
        });
      }
    }

    // Check for Groq API key
    if (!process.env.GROQ_API_KEY) {
      return res.json({
        success: true,
        reply: "I'm currently offline! Please contact us on WhatsApp: +91 70393 82706 for immediate assistance."
      });
    }

    // Build messages for Groq (OpenAI-compatible format)
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    res.json({
      success: true,
      reply: reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.json({
      success: true,
      reply: "I'm having trouble connecting right now. For immediate assistance, please contact us on WhatsApp: +91 70393 82706 or visit our FAQ page."
    });
  }
});

module.exports = router;
