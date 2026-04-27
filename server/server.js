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

// Services
const { syncInstagramPosts } = require('./services/instagramSync');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

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
    
    // Initial sync on startup (if token exists)
    if (process.env.INSTAGRAM_ACCESS_TOKEN) {
      syncInstagramPosts().catch(err => 
        console.log('Initial Instagram sync skipped:', err.message)
      );
    }
  });
});
