const express = require('express');
const router = express.Router();
const InstagramPost = require('../models/InstagramPost');
const { fetchPublicProfile, syncFromPublicProfile } = require('../services/instagramSync');

/**
 * GET /api/instagram/posts
 * Fetch Instagram posts with optional limit
 * Falls back to public scraping if DB is empty
 */
router.get('/posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    
    // Fetch more posts to account for duplicates, then deduplicate by permalink
    const fetchLimit = Math.min(limit * 3, 150);
    let posts = await InstagramPost.find()
      .sort({ timestamp: -1 })
      .limit(fetchLimit);

    // Deduplicate by shortcode (extract from permalink)
    // Same content can appear as both /p/SHORTCODE/ and /reel/SHORTCODE/
    const seen = new Set();
    posts = posts.filter(post => {
      // Extract shortcode from permalink (e.g., "DcQh1YFoIzv" from "/p/DcQh1YFoIzv/" or "/reel/DcQh1YFoIzv/")
      const match = post.permalink?.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
      const shortcode = match ? match[1] : post.postId;
      
      if (seen.has(shortcode)) {
        return false;
      }
      seen.add(shortcode);
      return true;
    }).slice(0, limit);

    // If DB is empty, try to fetch from public profile
    if (posts.length === 0) {
      try {
        const publicPosts = await fetchPublicProfile(limit);
        if (publicPosts.length > 0) {
          // Return public posts directly without saving (read-only fallback)
          return res.json({
            success: true,
            count: publicPosts.length,
            source: 'public',
            posts: publicPosts.map(post => ({
              postId: post.id,
              caption: post.caption || '',
              mediaUrl: post.mediaUrl,
              permalink: post.permalink,
              mediaType: post.mediaType,
              thumbnailUrl: post.thumbnailUrl || post.mediaUrl,
              likesCount: post.likeCount || 0,
              timestamp: post.timestamp
            }))
          });
        }
      } catch (scrapeErr) {
        console.error('Public scrape fallback failed:', scrapeErr.message);
      }
    }

    res.json({
      success: true,
      count: posts.length,
      posts: posts.map(post => ({
        postId: post.postId,
        caption: post.caption,
        mediaUrl: post.mediaUrl,
        permalink: post.permalink,
        mediaType: post.mediaType,
        thumbnailUrl: post.thumbnailUrl,
        likesCount: post.likesCount,
        timestamp: post.timestamp
      }))
    });
  } catch (error) {
    console.error('Error fetching Instagram posts:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Instagram posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/instagram/posts/:id
 * Fetch a single Instagram post by ID
 */
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await InstagramPost.findOne({ postId: req.params.id });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post: {
        postId: post.postId,
        caption: post.caption,
        mediaUrl: post.mediaUrl,
        permalink: post.permalink,
        mediaType: post.mediaType,
        thumbnailUrl: post.thumbnailUrl,
        likesCount: post.likesCount,
        timestamp: post.timestamp
      }
    });
  } catch (error) {
    console.error('Error fetching Instagram post:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Instagram post'
    });
  }
});

/**
 * POST /api/instagram/sync
 * Force re-sync Instagram posts (clears old data and fetches fresh)
 */
router.post('/sync', async (req, res) => {
  try {
    // Clear old posts
    await InstagramPost.deleteMany({});
    console.log('Cleared old Instagram posts');
    
    // Fetch fresh posts from public profile
    const result = await syncFromPublicProfile();
    
    res.json({
      success: true,
      message: 'Instagram posts re-synced',
      ...result
    });
  } catch (error) {
    console.error('Sync error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to sync Instagram posts',
      error: error.message
    });
  }
});

/**
 * GET /api/instagram/stats
 * Get Instagram feed stats
 */
router.get('/stats', async (req, res) => {
  try {
    const totalPosts = await InstagramPost.countDocuments();
    const videoPosts = await InstagramPost.countDocuments({
      mediaType: { $in: ['VIDEO', 'REEL'] }
    });

    res.json({
      success: true,
      stats: {
        totalPosts,
        imagePosts: totalPosts - videoPosts,
        videoPosts,
        lastSynced: await InstagramPost.findOne()
          .sort({ syncedAt: -1 })
          .select('syncedAt')
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
});

module.exports = router;
