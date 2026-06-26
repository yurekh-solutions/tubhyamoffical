const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const path = require('path');

// Load env vars
dotenv.config();

// Route imports
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const instagramRoutes = require('./routes/instagram');
const paymentRoutes = require('./routes/payment');
const chatRoutes = require('./routes/chat');
const blogRoutes = require('./routes/blogs');

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
    const isLocalhost = origin.match(/^https?:\/\/localhost:\d+/) || origin.match(/^https?:\/\/127\.0\.0\.1:\d+/);
    if (allowedOrigins.includes(origin) || isLocalhost) {
      return callback(null, true);
    }
    // In production, allow tubhyam domains and vercel
    if (origin.includes('tubhyam') || origin.includes('vercel.app') || origin.includes('onrender.com')) {
      return callback(null, true);
    }
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/blogs', blogRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
    
    // Schedule blog auto-publish every hour
    cron.schedule('0 * * * *', async () => {
      console.log('Checking for scheduled blogs to publish...');
      try {
        const Blog = require('./models/Blog');
        const now = new Date();
        
        // Find one blog that's scheduled and ready to publish
        const blogToPublish = await Blog.findOne({
          status: 'scheduled',
          scheduledPublishDate: { $lte: now }
        }).sort({ scheduledPublishDate: 1 });
        
        if (blogToPublish) {
          blogToPublish.status = 'published';
          blogToPublish.publishedAt = now;
          blogToPublish.scheduledPublishDate = null;
          await blogToPublish.save();
          console.log(`Published blog: "${blogToPublish.title}"`);
        } else {
          console.log('No blogs scheduled for publishing at this time');
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
