const express = require('express');
const router = express.Router();
const InstagramPost = require('../models/InstagramPost');

/**
 * GET /api/instagram/posts
 * Fetch Instagram posts with optional limit
 */
router.get('/posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const posts = await InstagramPost.find()
      .sort({ timestamp: -1 })
      .limit(Math.min(limit, 50));

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
