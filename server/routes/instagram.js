const express = require('express');
const router = express.Router();
const InstagramPost = require('../models/InstagramPost');
const { syncInstagramPosts } = require('../services/instagramSync');

// GET all synced Instagram posts
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const posts = await InstagramPost.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const totalCount = await InstagramPost.countDocuments();
    
    res.json({
      success: true,
      posts,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
});

// GET single post
router.get('/posts/:postId', async (req, res) => {
  try {
    const post = await InstagramPost.findOne({ postId: req.params.postId }).lean();
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch post' });
  }
});

// POST manual sync trigger
router.post('/sync', async (req, res) => {
  try {
    console.log('Manual Instagram sync triggered');
    const result = await syncInstagramPosts();
    
    res.json({
      success: true,
      message: 'Instagram sync completed',
      postsSynced: result.synced,
      postsUpdated: result.updated
    });
  } catch (error) {
    console.error('Instagram sync error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sync failed',
      error: error.message 
    });
  }
});

// GET sync status
router.get('/sync/status', async (req, res) => {
  try {
    const latestPost = await InstagramPost.findOne()
      .sort({ syncedAt: -1 })
      .select('syncedAt')
      .lean();
    
    const totalPosts = await InstagramPost.countDocuments();
    
    res.json({
      success: true,
      totalPosts,
      lastSync: latestPost?.syncedAt || null,
      hasToken: !!process.env.INSTAGRAM_ACCESS_TOKEN
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch status' });
  }
});

module.exports = router;
