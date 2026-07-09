const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Route imports
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const instagramRoutes = require('./routes/instagram');
const paymentRoutes = require('./routes/payment');
const chatRoutes = require('./routes/chat');
const blogRoutes = require('./routes/blogs');
const otpRoutes = require('./routes/otp');

// Services
const { syncInstagramPosts } = require('./services/instagramSync');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware — CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.LOCAL_FRONTEND_URL || 'http://localhost:8080',
  'https://tubhyam.in',
  'https://www.tubhyam.in',
  'https://tubhyamoffical.vercel.app',
  'http://localhost:8080',
  'http://localhost:3001',
  'http://127.0.0.1:8080',
  'https://inventory-app-pixl.onrender.com',
].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    // Allow any localhost port in development
    if (process.env.NODE_ENV !== 'production') {
      const isLocalhost = origin.match(/^https?:\/\/localhost:\d+/) || origin.match(/^https?:\/\/127\.0\.0\.1:\d+/);
      if (isLocalhost) return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In production, only allow tubhyam domains
    if (process.env.NODE_ENV === 'production' && (origin.includes('tubhyam.in') || origin.includes('tubhyamoffical.vercel.app'))) {
      return callback(null, true);
    }
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting — protect all API endpoints from abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Stricter rate limit for sensitive endpoints (payment, OTP, chat)
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per 15 minutes for sensitive routes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Apply general rate limit to all API routes
app.use('/api/', apiLimiter);

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are no longer needed in Mongoose 6+
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Routes — sensitive routes get stricter rate limits
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/payment', sensitiveLimiter, paymentRoutes);
app.use('/api/chat', sensitiveLimiter, chatRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/otp', sensitiveLimiter, otpRoutes);

// Health check (minimal info exposure)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  // All non-API routes serve the SPA
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/images/')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      res.status(404).json({ success: false, message: 'Route not found' });
    }
  });
} else {
  // 404 handler (dev only)
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Schedule Instagram sync every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      console.log('Running scheduled Instagram sync...');
      try {
        await syncInstagramPosts();
        console.log('Instagram sync completed');
      } catch (error) {
        console.error('Instagram sync failed:', error.message);
      }
    });
    
    // Schedule blog auto-publish every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      console.log('Checking for scheduled blogs to publish...');
      try {
        const Blog = require('./models/Blog');
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Find scheduled posts ready to publish (not on hold, must have image)
        const blogsToPublish = await Blog.find({
          status: 'scheduled',
          scheduledPublishDate: { $lte: now },
          held: false,
          image: { $ne: '' },
          content: { $ne: '<p>Content pending generation.</p>' }
        }).sort({ scheduledPublishDate: 1 }).limit(5);
        
        if (blogsToPublish.length > 0) {
          for (const blog of blogsToPublish) {
            blog.status = 'published';
            blog.publishedAt = now;
            blog.scheduledPublishDate = null;
            blog.held = false;
            await blog.save();
            console.log(`Published: "${blog.title}"`);
          }
          console.log(`Auto-published ${blogsToPublish.length} blog(s)`);
        } else {
          console.log('No blogs scheduled for publishing');
        }
      } catch (error) {
        console.error('Blog auto-publish failed:', error.message);
      }
    });
    
    // Initial sync on startup (if token exists)
    if (process.env.INSTAGRAM_ACCESS_TOKEN) {
      syncInstagramPosts().catch(err => 
        console.log('Initial Instagram sync skipped:', err.message)
      );
    }
  });
});
