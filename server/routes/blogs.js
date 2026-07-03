const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Groq = require('groq-sdk');
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const INVENTORY_API = process.env.INVENTORY_API_URL || 'http://localhost:3001';

console.log('[blogs.js] Route file loaded successfully');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'tubhyam_admin_2024';

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'Admin access required' });
  const token = authHeader.replace('Bearer ', '');
  const validTokens = [ADMIN_SECRET, 'tubhyam_admin_2024', 'tubhyam-admin-2024'];
  if (!validTokens.includes(token)) return res.status(401).json({ success: false, message: 'Admin access required' });
  next();
};

// ═══ ADMIN STATS & QUEUE ══════════════════════════════════════════════════════

router.get('/admin/queue', verifyAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find({ status: { $in: ['planned', 'generating', 'draft', 'scheduled'] } }).sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch queue' });
  }
});

router.get('/admin/stats', verifyAdmin, async (req, res) => {
  try {
    const [published, scheduled, draft, planned, failed] = await Promise.all([
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'scheduled' }),
      Blog.countDocuments({ status: 'draft' }),
      Blog.countDocuments({ status: 'planned' }),
      Blog.countDocuments({ status: 'failed' }),
    ]);
    res.json({ success: true, stats: { published, scheduled, draft, planned, failed, total: published + scheduled + draft + planned + failed } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// ═══ CAMPAIGNS ════════════════════════════════════════════════════════════════

// POST /campaigns — Create campaign + plan topics via LLM
router.post('/campaigns', verifyAdmin, async (req, res) => {
  try {
    const { keyword, days = 30, tone = 'Friendly', wordCount = 1000, imagesPerPost = 1, autoPublish = true, generationMode = 'jit' } = req.body;
    if (!keyword || !keyword.trim()) return res.status(400).json({ success: false, message: 'Keyword is required' });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ success: false, message: 'Groq API key not configured' });

    const campaignId = crypto.randomBytes(8).toString('hex');
    const numDays = Math.min(Math.max(parseInt(days) || 30, 1), 30);

    const prompt = `You are a senior content strategist for Tubhyam (tubhyam.in), a premium Indian women's fashion brand.

Create a ${numDays}-day blog content plan based on the seed keyword: "${keyword}"

For EACH day, generate a unique, non-overlapping blog topic. Vary the intent across: how-to guides, listicles, styling guides, buying guides, trend reports, FAQ posts, comparison posts, and seasonal pieces.

Tone: ${tone}. Target audience: Indian women 20-40.

Return ONLY valid JSON:
{
  "topics": [
    {
      "dayIndex": 1,
      "title": "SEO-optimized title (max 65 chars)",
      "focusKeyword": "primary focus keyword",
      "angle": "One-line description of the article angle",
      "category": "Category name",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}

Rules:
- Exactly ${numDays} topics
- Each title must include "${keyword}" or a close variant naturally
- All topics must be distinct — no duplicates or near-duplicates
- Categories: Fashion Trends, Styling Guide, Buying Guide, Trend Report, Outfit Ideas, Wardrobe Guide, Seasonal Fashion
- Tags: 3-5 relevant SEO tags per topic
- Focus keyword: the primary search term for that article

CRITICAL: Raw JSON only. No markdown blocks.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 4096,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) return res.status(500).json({ success: false, message: 'No response from AI' });

    let jsonStr = aiResponse.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();
    else { const m = jsonStr.match(/\{[\s\S]*\}/); if (m) jsonStr = m[0]; }

    let parsed;
    try { parsed = JSON.parse(jsonStr); } catch {
      jsonStr = jsonStr.replace(/"([^"]*?)\n([^"]*?)"/g, '"$1\\n$2"');
      parsed = JSON.parse(jsonStr);
    }

    const topics = parsed.topics || [];
    const startDate = new Date();
    const posts = [];

    for (const topic of topics) {
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(scheduledDate.getDate() + (topic.dayIndex - 1));

      const blog = new Blog({
        title: topic.title,
        content: '<p>Content pending generation.</p>',
        excerpt: topic.angle || '',
        category: topic.category || '',
        keywords: [keyword, topic.focusKeyword],
        image: '',
        author: 'ainos',
        readTime: 5,
        status: 'planned',
        scheduledPublishDate: autoPublish ? scheduledDate : null,
        autoPublish,
        generationMode,
        campaignId,
        dayIndex: topic.dayIndex,
        metaTitle: topic.title,
        metaDescription: topic.angle || '',
        focusKeyword: topic.focusKeyword || '',
        tags: topic.tags || [],
        generationStatus: 'planned',
        trendKeyword: keyword,
        trendSource: 'campaign',
      });
      await blog.save();
      posts.push(blog);
    }

    res.json({
      success: true,
      campaign: {
        id: campaignId,
        keyword,
        days: topics.length,
        autoPublish,
        generationMode,
        startDate: startDate.toISOString(),
      },
      posts: posts.map(p => ({
        _id: p._id, title: p.title, dayIndex: p.dayIndex, status: p.status,
        focusKeyword: p.focusKeyword, category: p.category, scheduledPublishDate: p.scheduledPublishDate,
        image: p.image, generationStatus: p.generationStatus,
      })),
      message: `Campaign created with ${topics.length} planned posts`,
    });
  } catch (error) {
    console.error('Campaign creation failed:', error);
    if (error.status === 429 || error.code === 'rate_limit_exceeded') {
      const retryAfter = error.headers?.get?.('retry-after') || '300';
      return res.status(429).json({ success: false, message: `Groq rate limit reached. Wait ~${Math.ceil(retryAfter / 60)} minutes and try again.` });
    }
    res.status(500).json({ success: false, message: 'Failed to create campaign', error: error.message });
  }
});

// GET /campaigns — List all campaigns
router.get('/campaigns', verifyAdmin, async (req, res) => {
  try {
    const INVALID_IDS = ['', 'undefined', 'null', 'NaN'];
    const posts = await Blog.find({
      campaignId: { $exists: true, $nin: [...INVALID_IDS, null], $regex: /.{4,}/ }
    }).sort({ campaignId: 1, dayIndex: 1 });
    const campaignMap = {};
    for (const p of posts) {
      if (!campaignMap[p.campaignId]) {
        campaignMap[p.campaignId] = {
          id: p.campaignId, keyword: p.trendKeyword, posts: [],
          published: 0, scheduled: 0, planned: 0, failed: 0, total: 0,
          autoPublish: p.autoPublish, generationMode: p.generationMode,
        };
      }
      const c = campaignMap[p.campaignId];
      c.posts.push({ _id: p._id, title: p.title, dayIndex: p.dayIndex, status: p.status, focusKeyword: p.focusKeyword, image: p.image, scheduledPublishDate: p.scheduledPublishDate, held: p.held, generationStatus: p.generationStatus, autoPublish: p.autoPublish, generationMode: p.generationMode });
      c.total++;
      if (p.status === 'published') c.published++;
      else if (p.status === 'scheduled') c.scheduled++;
      else if (p.status === 'planned') c.planned++;
      else if (p.status === 'failed') c.failed++;
    }
    res.json({ success: true, campaigns: Object.values(campaignMap).reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to list campaigns' });
  }
});

// GET /campaigns/:id — Get single campaign with all posts
router.get('/campaigns/:id', verifyAdmin, async (req, res) => {
  try {
    const posts = await Blog.find({ campaignId: req.params.id }).sort({ dayIndex: 1 });
    if (posts.length === 0) return res.status(404).json({ success: false, message: 'Campaign not found' });
    const first = posts[0];
    res.json({
      success: true,
      campaign: { id: first.campaignId, keyword: first.trendKeyword, totalPosts: posts.length, autoPublish: first.autoPublish, generationMode: first.generationMode },
      posts: posts.map(p => ({
        _id: p._id, title: p.title, dayIndex: p.dayIndex, status: p.status,
        focusKeyword: p.focusKeyword, category: p.category, image: p.image,
        scheduledPublishDate: p.scheduledPublishDate, held: p.held,
        generationStatus: p.generationStatus, excerpt: p.excerpt, readTime: p.readTime,
        metaTitle: p.metaTitle, metaDescription: p.metaDescription, tags: p.tags,
        autoPublish: p.autoPublish, generationMode: p.generationMode,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch campaign' });
  }
});

// POST /campaigns/:id/generate — Generate content for all planned posts in a campaign
router.post('/campaigns/:id/generate', verifyAdmin, async (req, res) => {
  try {
    const posts = await Blog.find({ campaignId: req.params.id, status: 'planned' }).sort({ dayIndex: 1 });
    if (posts.length === 0) return res.status(400).json({ success: false, message: 'No planned posts to generate' });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ success: false, message: 'Groq API key not configured' });

    const results = [];
    const errors = [];

    for (const post of posts) {
      try {
        post.status = 'generating';
        post.generationStatus = 'generating';
        await post.save();

        const articleData = await generateCampaignArticle(post.trendKeyword, post);
        if (!articleData) throw new Error('AI returned empty response');

        post.title = articleData.title || post.title;
        post.excerpt = articleData.excerpt || post.excerpt;
        post.metaTitle = articleData.metaTitle || post.title;
        post.metaDescription = articleData.metaDescription || post.excerpt;
        post.readTime = calcReadTime(articleData.content);

        // Generate hero image (first image)
        const heroPrompt = buildHighFidelityImagePrompt(post.trendKeyword || post.focusKeyword, null, post.dayIndex);
        post.image = buildImageUrl(heroPrompt, post.trendKeyword || post.focusKeyword, post.dayIndex);

        // Generate inline images from AI prompts
        const inlineImages = [];
        let content = articleData.content || '';
        
        if (articleData.imagePrompts && articleData.imagePrompts.length > 0) {
          for (let i = 0; i < Math.min(articleData.imagePrompts.length, 5); i++) {
            const imgPrompt = articleData.imagePrompts[i];
            const enhancedPrompt = `STRICTLY FACELESS PHOTOGRAPH, cropped at chin showing only neck downward, NO FACE NO HEAD NO FOREHEAD NO EYES NO HAIR visible in frame, ${imgPrompt}, ${PHOTO_PRESET}, photorealistic, magazine quality, no text overlay, no watermark, sharp focus on garment details and fabric texture`;
            const imgUrl = buildImageUrl(enhancedPrompt, `${post.trendKeyword}-inline-${i}`, post.dayIndex * 100 + i);
            
            inlineImages.push({
              url: imgUrl,
              altText: `${post.focusKeyword} style ${i + 1} - Tubhyam fashion guide`,
              role: i === 0 ? 'hero-inline' : `section-${i}`
            });
            
            // Replace placeholder with actual image
            const placeholder = `[IMAGE_${i + 1}]`;
            const imgHtml = `<figure style="margin: 32px 0;"><img src="${imgUrl}" alt="${post.focusKeyword} style ${i + 1}" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">${post.focusKeyword} - Style Inspiration</figcaption></figure>`;
            content = content.replace(placeholder, imgHtml);
            
            // Add delay to avoid rate limiting
            await new Promise(r => setTimeout(r, 1500));
          }
        }
        
        // Remove any remaining placeholders
        content = content.replace(/\[IMAGE_\d+\]/g, '');
        post.content = content;
        post.inlineImages = inlineImages;

        post.status = post.scheduledPublishDate ? 'scheduled' : 'draft';
        post.generationStatus = 'ready';
        post.errorMessage = '';
        await post.save();
        results.push({ _id: post._id, title: post.title, dayIndex: post.dayIndex, status: post.status, imageCount: inlineImages.length });
        await new Promise(r => setTimeout(r, 3000));
      } catch (err) {
        post.status = 'failed';
        post.generationStatus = 'failed';
        post.errorMessage = err.message;
        await post.save();
        errors.push({ _id: post._id, dayIndex: post.dayIndex, error: err.message });
      }
    }

    res.json({ success: true, message: `Generated ${results.length} of ${posts.length} posts with ${results.reduce((sum, r) => sum + (r.imageCount || 0), 0)} inline images`, results, errors: errors.length ? errors : undefined });
  } catch (error) {
    console.error('Campaign generation failed:', error);
    if (error.status === 429 || error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ success: false, message: 'Groq rate limit reached. Wait a few minutes and try again.' });
    }
    res.status(500).json({ success: false, message: 'Failed to generate campaign', error: error.message });
  }
});

// POST /campaigns/:id/pause — Hold all non-published posts
router.post('/campaigns/:id/pause', verifyAdmin, async (req, res) => {
  try {
    await Blog.updateMany({ campaignId: req.params.id, status: { $in: ['planned', 'draft', 'scheduled'] } }, { held: true });
    res.json({ success: true, message: 'Campaign paused — all posts on hold' });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to pause campaign' }); }
});

// POST /campaigns/:id/resume — Unhold all posts
router.post('/campaigns/:id/resume', verifyAdmin, async (req, res) => {
  try {
    await Blog.updateMany({ campaignId: req.params.id }, { held: false });
    res.json({ success: true, message: 'Campaign resumed — holds removed' });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to resume campaign' }); }
});

// POST /campaigns/cleanup — Remove orphaned posts with invalid campaignIds
router.post('/campaigns/cleanup', verifyAdmin, async (req, res) => {
  try {
    const result = await Blog.deleteMany({
      $or: [
        { campaignId: '' },
        { campaignId: 'undefined' },
        { campaignId: 'null' },
        { campaignId: null },
        { campaignId: { $exists: false } },
      ]
    });
    res.json({ success: true, message: `Cleaned up ${result.deletedCount} orphaned posts` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cleanup failed' });
  }
});

// DELETE /campaigns/all — Delete ALL campaigns and their posts
router.delete('/campaigns/all', verifyAdmin, async (req, res) => {
  try {
    const result = await Blog.deleteMany({ campaignId: { $ne: '', $exists: true } });
    res.json({ success: true, message: `All campaigns deleted — ${result.deletedCount} posts removed` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete campaigns' });
  }
});

// DELETE /campaigns/:id — Delete entire campaign and all its posts
router.delete('/campaigns/:id', verifyAdmin, async (req, res) => {
  try {
    const campaignId = req.params.id;
    if (!campaignId || campaignId === 'undefined' || campaignId === 'null') {
      return res.status(400).json({ success: false, message: 'Invalid campaign ID' });
    }
    const result = await Blog.deleteMany({ campaignId });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, message: `Campaign deleted — ${result.deletedCount} posts removed` });
  } catch (error) {
    console.error('Campaign deletion failed:', error);
    res.status(500).json({ success: false, message: 'Failed to delete campaign' });
  }
});

// ═══ POSTS (individual) ═══════════════════════════════════════════════════════

// GET /posts/:id
router.get('/posts/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, post: blog });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to fetch post' }); }
});

// PUT /posts/:id — Edit post
router.put('/posts/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });
    const fields = ['title', 'content', 'excerpt', 'slug', 'category', 'metaTitle', 'metaDescription', 'focusKeyword', 'tags', 'scheduledPublishDate', 'held'];
    for (const f of fields) { if (req.body[f] !== undefined) blog[f] = req.body[f]; }
    await blog.save();
    res.json({ success: true, message: 'Post updated', post: blog });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to update post' }); }
});

// POST /posts/:id/regenerate
router.post('/posts/:id/regenerate', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });
    const { target = 'all', instruction = '' } = req.body;

    if (target === 'text' || target === 'all') {
      const articleData = await generateCampaignArticle(blog.trendKeyword || blog.focusKeyword, blog, instruction);
      if (articleData) {
        blog.title = articleData.title || blog.title;
        blog.excerpt = articleData.excerpt || blog.excerpt;
        blog.metaTitle = articleData.metaTitle || blog.title;
        blog.metaDescription = articleData.metaDescription || blog.excerpt;
        blog.readTime = calcReadTime(articleData.content);

        // Generate inline images from AI prompts
        const inlineImages = [];
        let content = articleData.content || '';
        
        if (articleData.imagePrompts && articleData.imagePrompts.length > 0 && target === 'all') {
          for (let i = 0; i < Math.min(articleData.imagePrompts.length, 5); i++) {
            const imgPrompt = articleData.imagePrompts[i];
            const enhancedPrompt = `STRICTLY FACELESS PHOTOGRAPH, cropped at chin showing only neck downward, NO FACE NO HEAD NO FOREHEAD NO EYES NO HAIR visible in frame, ${imgPrompt}, ${PHOTO_PRESET}, photorealistic, magazine quality, no text overlay, no watermark, sharp focus on garment details and fabric texture`;
            const imgUrl = buildImageUrl(enhancedPrompt, `${blog.trendKeyword}-inline-${i}`, (blog.dayIndex || 1) * 100 + i);
            
            inlineImages.push({
              url: imgUrl,
              altText: `${blog.focusKeyword} style ${i + 1} - Tubhyam fashion guide`,
              role: i === 0 ? 'hero-inline' : `section-${i}`
            });
            
            // Replace placeholder with actual image
            const placeholder = `[IMAGE_${i + 1}]`;
            const imgHtml = `<figure style="margin: 32px 0;"><img src="${imgUrl}" alt="${blog.focusKeyword} style ${i + 1}" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">${blog.focusKeyword} - Style Inspiration</figcaption></figure>`;
            content = content.replace(placeholder, imgHtml);
            
            await new Promise(r => setTimeout(r, 1500));
          }
        }
        
        content = content.replace(/\[IMAGE_\d+\]/g, '');
        blog.content = content;
        blog.inlineImages = inlineImages;
      }
    }
    if (target === 'images' || target === 'all') {
      const imagePrompt = buildHighFidelityImagePrompt(blog.trendKeyword || blog.focusKeyword, null, blog.dayIndex || 1);
      blog.image = buildImageUrl(imagePrompt, blog.trendKeyword || blog.focusKeyword, Date.now());
    }
    blog.status = blog.scheduledPublishDate ? 'scheduled' : 'draft';
    blog.generationStatus = 'ready';
    blog.errorMessage = '';
    await blog.save();
    res.json({ success: true, message: 'Post regenerated', post: blog });
  } catch (error) {
    console.error('Regenerate failed:', error);
    res.status(500).json({ success: false, message: 'Failed to regenerate', error: error.message });
  }
});

// POST /posts/:id/hold — Toggle hold
router.post('/posts/:id/hold', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });
    blog.held = !blog.held;
    await blog.save();
    res.json({ success: true, message: blog.held ? 'Post on hold' : 'Hold removed', held: blog.held });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to toggle hold' }); }
});

// POST /posts/:id/publish
router.post('/posts/:id/publish', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.status = 'published';
    blog.publishedAt = new Date();
    blog.scheduledPublishDate = null;
    blog.held = false;
    await blog.save();
    res.json({ success: true, message: 'Blog published successfully', blog });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to publish blog' }); }
});

// POST /posts/:id/unpublish
router.post('/posts/:id/unpublish', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.status = 'draft';
    blog.publishedAt = null;
    await blog.save();
    res.json({ success: true, message: 'Blog unpublished' });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to unpublish' }); }
});

// DELETE /posts/:id
router.delete('/posts/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to delete blog' }); }
});

// ═══ BATCH IMAGE REFRESH — Replace ALL AI images with real product photos ═══

async function getProductImageMapping() {
  const CATEGORY_MAP = {
    'formal pants': ['formals', 'formal', 'formal pant', 'trouser', 'slimfit'],
    'formal': ['formals', 'formal', 'formal pant', 'trouser', 'slimfit'],
    'trousers': ['formals', 'formal', 'trouser'],
    'palazzo': ['palazzo', 'palazos', 'widelook'],
    'wide leg': ['jeans', 'denim', 'wide leg', 'wide-leg', 'mom'],
    'baggy jeans': ['jeans', 'denim', 'mom'],
    'jeans': ['jeans', 'denim'],
    'denim': ['jeans', 'denim'],
    'cargo': ['cargo', 'tracks'],
    'track pants': ['tracks', 'track pant', 'jogger'],
    'jogger': ['tracks', 'track pant', 'jogger'],
    'casual': ['casual', 'cotton', 'linen', 'lace'],
    'cotton': ['cotton', 'casual'],
    'linen': ['linen', 'casual'],
    'ethnic': ['ethnic', 'kurta', 'saree'],
    'kurta': ['ethnic', 'kurta'],
    'saree': ['ethnic', 'saree'],
    'western': ['western', 'western wear', 'top'],
    'western wear': ['western', 'western wear', 'top'],
    'blazer': ['formals', 'blazer', 'formal'],
    'office wear': ['formals', 'formal', 'office', 'belt'],
    'kurti': ['ethnic', 'kurta', 'kurti'],
    'cordset': ['cordset'],
    'lace': ['lace'],
  };

  // Try inventory API first
  try {
    const { data } = await axios.get(`${INVENTORY_API}/api/products`, { timeout: 15000 });
    const products = Array.isArray(data) ? data : [];

    const imagesByCategory = {};
    for (const p of products) {
      const cat = (p.category || '').toLowerCase().trim();
      const imgs = (p.images || []).map(img =>
        img.startsWith('http') ? img : `${INVENTORY_API}${img}`
      );
      if (imgs.length > 0 && cat) {
        if (!imagesByCategory[cat]) imagesByCategory[cat] = [];
        // Pick only the FIRST image per product to avoid showing same product multiple times
        imagesByCategory[cat].push({ url: imgs[0], productId: p._id || p.id || imgs[0] });
      }
    }

    const mapping = {};
    const allImages = Object.values(imagesByCategory).flat();

    for (const [keyword, categoryFilters] of Object.entries(CATEGORY_MAP)) {
      const matched = [];
      const seenProducts = new Set();
      for (const [cat, imgs] of Object.entries(imagesByCategory)) {
        if (categoryFilters.some(f => cat.includes(f) || f.includes(cat))) {
          for (const entry of imgs) {
            if (!seenProducts.has(entry.productId)) {
              seenProducts.add(entry.productId);
              matched.push(entry);
            }
          }
        }
      }
      mapping[keyword] = matched.length > 0 ? matched : allImages;
    }
    // Deduplicate all images by product
    const allDeduped = [];
    const allSeen = new Set();
    for (const entry of allImages) {
      if (!allSeen.has(entry.productId)) {
        allSeen.add(entry.productId);
        allDeduped.push(entry);
      }
    }
    mapping['all'] = allDeduped;
    if (allImages.length > 0) return mapping;
  } catch (err) {
    console.log('[ProductImages] Inventory API unavailable, using local fallback');
  }

  // Fallback: scan local public/images/products directory
  try {
    const localDir = path.join(__dirname, '..', '..', 'public', 'images', 'products');
    if (fs.existsSync(localDir)) {
      const files = fs.readdirSync(localDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
      const localImages = files.map(f => `/images/products/${f}`);

      // Categorize by filename keywords — must match CATEGORY_MAP keys
      const imagesByCategory = {};
      for (const img of localImages) {
        const name = path.basename(img, path.extname(img)).toLowerCase();
        const cats = [];
        // Belt images
        if (name.includes('belt')) cats.push('office wear');
        // Formal pants
        if (name.includes('formal') || name.includes('slimfit') || name.includes('trouser') || name.includes('beggyplated') || name.includes('plated') || name.includes('imported-beggy') || name.includes('preuim') || name.includes('premium')) cats.push('formal pants');
        // Palazzo / wide-leg (but NOT plated/beggyplated which are formal)
        if ((name.includes('widelook') || name.includes('palazzo')) && !name.includes('formal')) cats.push('palazzo');
        // Jeans
        if ((name.includes('jeans') || name.includes('denim') || (name.includes('mom') && !name.includes('track'))) && !name.includes('formal')) cats.push('jeans');
        // Cargo
        if (name.includes('cargo')) cats.push('cargo');
        // Track pants
        if (name.includes('track') || name.includes('jogger')) cats.push('track pants');
        // Lace
        if (name.includes('lace') && !name.includes('belt')) cats.push('lace');
        // Cordset
        if (name.includes('cordset')) cats.push('cordset');
        // Casual (catch-all for colored casual pants)
        if (name.includes('causal') || name.includes('casual')) cats.push('casual');
        if (cats.length === 0) cats.push('formal pants'); // default fallback
        const pseudoId = name;
        for (const c of cats) {
          if (!imagesByCategory[c]) imagesByCategory[c] = [];
          imagesByCategory[c].push({ url: img, productId: pseudoId });
        }
      }

      const mapping = {};
      const allImages = [];
      const allSeen = new Set();
      for (const entry of Object.values(imagesByCategory).flat()) {
        if (!allSeen.has(entry.productId)) {
          allSeen.add(entry.productId);
          allImages.push(entry);
        }
      }

      for (const [keyword, categoryFilters] of Object.entries(CATEGORY_MAP)) {
        const matched = [];
        const seenProducts = new Set();
        for (const [cat, imgs] of Object.entries(imagesByCategory)) {
          if (categoryFilters.some(f => cat.includes(f) || f.includes(cat))) {
            for (const entry of imgs) {
              if (!seenProducts.has(entry.productId)) {
                seenProducts.add(entry.productId);
                matched.push(entry);
              }
            }
          }
        }
        mapping[keyword] = matched.length > 0 ? matched : allImages;
      }
      mapping['all'] = allImages;
      return mapping;
    }
  } catch (err) {
    console.error('Local image fallback failed:', err.message);
  }

  return { all: [] };
}

function getBestImagesForPost(mapping, post) {
  const searchTerms = [
    post.trendKeyword || '',
    post.focusKeyword || '',
    ...(post.keywords || []),
    ...(post.tags || []),
    post.category || '',
  ].map(t => (t || '').toLowerCase().trim()).filter(Boolean);

  for (const term of searchTerms) {
    for (const [key, imgs] of Object.entries(mapping)) {
      if (key === 'all') continue;
      if (term.includes(key) || key.includes(term)) {
        return imgs;
      }
    }
  }
  return mapping['all'] || [];
}

// POST /posts/batch-refresh-images — Replace ALL blog images with real product photos
router.post('/posts/batch-refresh-images', verifyAdmin, async (req, res) => {
  try {
    const mapping = await getProductImageMapping();
    const allImages = mapping['all'] || [];

    if (allImages.length === 0) {
      return res.json({ success: false, message: 'No product images available in inventory. Add products first.' });
    }

    const blogs = await Blog.find({ status: 'published' });
    const results = [];

    for (const blog of blogs) {
      try {
        const bestImages = getBestImagesForPost(mapping, blog);
        if (bestImages.length === 0) continue;

        // 1. Set hero image to real product photo
        blog.image = bestImages[0].url;

        // 2. Strip ALL old figure tags (both Pollinations and old product images)
        let content = blog.content || '';
        content = content.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
        // Also remove any standalone img tags
        content = content.replace(/<img[^>]*pollinations[^>]*\/?>/gi, '');
        content = content.replace(/<img[^>]*image\.pollinations[^>]*\/?>/gi, '');

        // 3. Insert NEW figure tags with real product photos at natural break points
        const inlineImages = [];
        const paragraphs = content.split('</p>');
        let newContent = '';
        let imgIdx = 0;

        for (let i = 0; i < paragraphs.length; i++) {
          newContent += paragraphs[i];
          if (i < paragraphs.length - 1) newContent += '</p>';

          // Insert an image after every 2-3 paragraphs
          if ((i + 1) % 3 === 0 && imgIdx < Math.min(bestImages.length - 1, 5)) {
            imgIdx++;
            const imgUrl = bestImages[imgIdx % bestImages.length].url;
            const altText = `${blog.focusKeyword || blog.category} - Tubhyam Collection`;
            newContent += `<figure style="margin: 32px 0;"><img src="${imgUrl}" alt="${altText}" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">${blog.focusKeyword || blog.category} - Tubhyam Collection</figcaption></figure>`;
            inlineImages.push({
              url: imgUrl,
              altText: altText,
              role: `section-${imgIdx}`
            });
          }
        }

        blog.content = newContent;
        blog.inlineImages = inlineImages;
        await blog.save();
        results.push({ id: blog._id, title: blog.title, imagesAdded: inlineImages.length + 1 });
      } catch (err) {
        results.push({ id: blog._id, title: blog.title, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Refreshed images for ${results.filter(r => !r.error).length} of ${blogs.length} posts`,
      results
    });
  } catch (error) {
    console.error('Batch refresh failed:', error);
    res.status(500).json({ success: false, message: 'Failed to refresh images', error: error.message });
  }
});

// POST /posts/:id/refresh-images — Refresh images for a single post
router.post('/posts/:id/refresh-images', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Post not found' });

    const mapping = await getProductImageMapping();
    const bestImages = getBestImagesForPost(mapping, blog);

    if (bestImages.length === 0) {
      return res.json({ success: false, message: 'No product images available' });
    }

    // Set hero
    blog.image = bestImages[0].url;

    // Strip old images
    let content = blog.content || '';
    content = content.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
    content = content.replace(/<img[^>]*pollinations[^>]*\/?>/gi, '');

    // Insert new product images
    const inlineImages = [];
    const paragraphs = content.split('</p>');
    let newContent = '';
    let imgIdx = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      newContent += paragraphs[i];
      if (i < paragraphs.length - 1) newContent += '</p>';
      if ((i + 1) % 3 === 0 && imgIdx < Math.min(bestImages.length - 1, 5)) {
        imgIdx++;
        const imgUrl = bestImages[imgIdx % bestImages.length].url;
        const altText = `${blog.focusKeyword || blog.category} - Tubhyam Collection`;
        newContent += `<figure style="margin: 32px 0;"><img src="${imgUrl}" alt="${altText}" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">${blog.focusKeyword || blog.category} - Tubhyam Collection</figcaption></figure>`;
        inlineImages.push({ url: imgUrl, altText, role: `section-${imgIdx}` });
      }
    }

    blog.content = newContent;
    blog.inlineImages = inlineImages;
    await blog.save();

    res.json({ success: true, message: `Refreshed with ${inlineImages.length + 1} product images`, post: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to refresh', error: error.message });
  }
});

// GET /admin/search?q=keyword — Search blog posts
router.get('/admin/search', verifyAdmin, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ success: true, blogs: [] });
    const regex = new RegExp(q, 'i');
    const blogs = await Blog.find({
      $or: [
        { title: regex },
        { focusKeyword: regex },
        { slug: regex },
        { excerpt: regex },
        { tags: regex },
        { trendKeyword: regex },
      ]
    }).sort({ createdAt: -1 }).select('-content');
    res.json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search blogs' });
  }
});

// ═══ PUBLIC ROUTES ═══════════════════════════════════════════════════════════

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).sort({ publishedAt: -1 }).select('-content');
    res.json({ success: true, count: blogs.length, blogs });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to fetch blogs' }); }
});

// GET /product-images — Returns real Tubhyam product images mapped to blog keywords
router.get('/product-images', async (req, res) => {
  try {
    const mapping = await getProductImageMapping();
    // Convert {url, productId} objects back to plain URL strings for frontend
    const urlMapping = {};
    let totalImages = 0;
    for (const [key, entries] of Object.entries(mapping)) {
      urlMapping[key] = entries.map(e => e.url);
      if (key === 'all') totalImages = entries.length;
    }
    res.json({ success: true, mapping: urlMapping, totalProducts: 0, totalImages });
  } catch (error) {
    console.error('Product images error:', error.message);
    res.json({ success: true, mapping: { all: [] }, totalProducts: 0, totalImages: 0 });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, blog });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to fetch blog' }); }
});

// ═══ FACELESS IMAGE GENERATION ════════════════════════════════════════════════

// Professional photography style preset - GARMENT FOCUSED, NO FACE
const PHOTO_PRESET = 'garment-focused fashion photography, shot from collar-bone downward, Canon EOS R5, 85mm f/1.8 lens, soft natural lighting, shallow depth of field on fabric texture, warm color grading, premium fabric detail, Vogue India editorial';

const KEYWORD_SCENES = {
  'western wear': 'faceless crop from chin down, trendy western outfit, hands resting on designer bag, modern minimalist studio',
  'western': 'faceless crop from chin down, stylish western wear with leather handbag and heels, urban cafe setting',
  'top': 'faceless crop from chin down, fashionable silk blouse with high-waisted jeans, bright studio, hands on hip',
  'formal pants': 'faceless crop from chin down, tailored charcoal formal pants with white silk blouse, modern glass office, laptop bag',
  'trousers': 'faceless crop from chin down, structured high-waisted trousers with elegant cream top, marble studio, hands in pockets',
  'palazzo': 'faceless crop from chin down, flowing ivory palazzo pants with fitted black top, outdoor terrace with plants',
  'wide leg': 'faceless crop from chin down, high-waisted wide-leg denim jeans with tucked-in white shirt, minimalist white studio, hands in pockets',
  'cargo': 'faceless crop from chin down, olive cargo pants with black crop top and white sneakers, urban street with graffiti',
  'track pants': 'faceless crop from chin down, stylish black track pants with cropped hoodie and sneakers, outdoor park path',
  'jogger': 'faceless crop from chin down, slim beige joggers with oversized cream sweatshirt, park bench setting',
  'jeans': 'faceless crop from chin down, perfect-fit blue jeans with white t-shirt and leather belt, city street with warm sunlight',
  'denim': 'faceless crop from chin down, classic blue denim jeans with denim jacket over white top, street style',
  'casual': 'faceless crop from chin down, relaxed casual outfit with light wash jeans and white sneakers, cozy cafe interior',
  'ootd': 'faceless crop from chin down, styled outfit of the day, hands on designer handbag, Instagram-worthy setting',
  'gen z': 'faceless crop from chin down, gen-z trendy outfit with baggy jeans and layered necklaces, neon-lit studio',
  'genz': 'faceless crop from chin down, youthful trendy outfit with oversized blazer and chunky sneakers, urban street',
  'streetwear': 'faceless crop from chin down, oversized streetwear hoodie with baggy pants and chunky sneakers, graffiti wall background',
  'summer': 'faceless crop from chin down, light linen summer outfit with strappy sandals and woven tote, sunny garden setting',
  'winter': 'faceless crop from chin down, cozy winter layers with wool scarf and ankle boots, warm indoor with window light',
  'ethnic': 'faceless crop from chin down, fusion ethnic-western outfit with silver jhumkas and contemporary kurta, art gallery',
  'kurta': 'faceless crop from chin down, modern printed kurta with white jeans and embroidered juttis, bright patio with flowers',
  'saree': 'faceless crop from chin down, modern saree drape with statement earrings and heels, elegant marble venue',
  'wardrobe': 'faceless crop from chin down, selecting from organized capsule wardrobe, walk-in closet with white shelves',
  'occasion': 'faceless crop from chin down, elegant occasion wear with embellished clutch and heels, luxury hotel lobby',
  'body type': 'faceless crop from chin down, perfectly fitted flattering outfit, warm studio with soft lighting',
  'color': 'faceless crop from chin down, bold color-blocked outfit with coordinated accessories, vibrant gradient background',
  'blazer': 'faceless crop from chin down, structured navy blazer with matching trousers and pointed heels, corporate office lobby',
  'dress': 'faceless crop from chin down, elegant midi dress with strappy heels and clutch, evening cocktail setting',
  'party': 'faceless crop from chin down, glamorous sequin party outfit with statement earrings, nightlife venue with ambient lighting',
  'beige': 'faceless crop from chin down, beige-toned monochrome outfit with tan accessories, neutral cream studio',
  'cotton': 'faceless crop from chin down, soft organic cotton outfit with natural drape and texture, airy bright room with plants',
  'linen': 'faceless crop from chin down, premium linen outfit with relaxed fit, airy bright room with natural light',
  'formal': 'faceless crop from chin down, tailored formal outfit with structured blazer and pointed-toe pumps, professional setting',
  'office wear': 'faceless crop from chin down, professional outfit with laptop bag and minimal jewelry, modern co-working space',
  'sustainable': 'faceless crop from chin down, eco-friendly organic cotton outfit, green garden setting with natural light',
  'travel': 'faceless crop from chin down, travel-ready comfortable outfit with leather tote and sunglasses, airport lounge interior',
};
const DEFAULT_SCENE = 'faceless crop from chin down, stylish contemporary outfit, hands visible with designer accessories, clean white studio';

function getSceneForKeyword(keyword) {
  if (!keyword) return DEFAULT_SCENE;
  const lower = keyword.toLowerCase();
  for (const key of Object.keys(KEYWORD_SCENES)) {
    if (lower === key || lower.includes(key)) return KEYWORD_SCENES[key];
  }
  if (lower.includes('jean') || lower.includes('denim')) return KEYWORD_SCENES['jeans'];
  if (lower.includes('pant') || lower.includes('trouser')) return KEYWORD_SCENES['formal pants'];
  if (lower.includes('formal')) return KEYWORD_SCENES['formal'];
  return DEFAULT_SCENE;
}

function buildHighFidelityImagePrompt(keyword) {
  const scene = getSceneForKeyword(keyword);
  return `STRICTLY FACELESS PHOTOGRAPH, cropped at chin showing only neck downward, NO FACE NO HEAD NO FOREHEAD NO EYES NO HAIR visible in frame, ${scene}, ${PHOTO_PRESET}, photorealistic, magazine quality, no text overlay, no watermark, sharp focus on garment details and fabric texture`;
}

function buildImageUrl(prompt, keyword, index) {
  const seed = `tubhyam-${(keyword || 'blog').replace(/\s+/g, '-')}-${index}-${Math.floor(Math.random() * 99999)}`;
  const negative = 'face, head, eyes, nose, mouth, lips, hair, forehead, ears, eyebrows, eyelashes, chin visible, neck up, skull, portrait, selfie, upper body portrait, distorted, blurry, low quality, text, watermark, cartoon, illustration, painting, ugly, deformed';
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&seed=${seed}&nologo=true&model=flux&negative=${encodeURIComponent(negative)}`;
}

// ═══ ARTICLE GENERATION (LEVI'S STYLE - MULTI-IMAGE) ════════════════════════

async function generateCampaignArticle(keyword, post, extraInstruction = '') {
  const tweakLine = extraInstruction ? `\nAdditional instruction: ${extraInstruction}` : '';
  const focusKw = post.focusKeyword || keyword;
  
  const prompt = `You are a senior fashion editor for Tubhyam (tubhyam.in), a premium Indian women's fashion brand. Voice: warm, inclusive, body-positive, expert-level.

Write a magazine-quality blog article like Levi's or Vogue India:
- Title: "${post.title}"
- Focus keyword: "${focusKw}"
- Angle: ${post.excerpt || 'Comprehensive fashion guide'}
- Target audience: Indian women 20-40${tweakLine}

ARTICLE STRUCTURE (Levi's Blog Style):
1. HOOK INTRO (100-150 words): Engaging opening that mentions ${focusKw}, why it's trending, who it's for
2. WHAT IS IT? (100 words): Define the style/trend clearly with quotable definition
3. TYPES/VARIATIONS (200 words): 3-4 different styles with H3 subheadings, describe each variation
4. HOW TO STYLE (250 words): 4-5 practical styling tips with specific outfit combinations
5. BODY TYPES & FIT GUIDE (100 words): Which styles suit which body types
6. OCCASIONS (100 words): Where to wear each style
7. COMMON MISTAKES TO AVOID (80 words): 3-4 bullet points
8. FAQ (150 words): 3-4 most-searched questions with detailed answers
9. CLOSING CTA (50 words): Inspiring wrap-up with <a href="/products">Explore Tubhyam's Collection</a>

CONTENT REQUIREMENTS:
- Total: 1000-1400 words in clean HTML
- Use: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>
- SEO: Use "${focusKw}" 6-8 times naturally, include in first 100 words, H2s, and closing
- Mention Tubhyam 2-3 times naturally
- Include 5 image placeholders: [IMAGE_1], [IMAGE_2], [IMAGE_3], [IMAGE_4], [IMAGE_5]
  - Place [IMAGE_1] after intro paragraph
  - Place [IMAGE_2] after types section
  - Place [IMAGE_3] after styling tips
  - Place [IMAGE_4] after body types section
  - Place [IMAGE_5] before FAQ section
- NO pricing, product IDs, or specific product names
- Use fashion terminology: silhouette, drape, fit, rise, wash, styling, ensemble
- Reference Indian fashion context: festivals, weddings, office wear, casual outings

Return ONLY valid JSON:
{"title":"SEO title max 65 chars","excerpt":"Engaging 2-sentence excerpt","metaTitle":"Max 60 chars","metaDescription":"150-160 chars with keyword","content":"<p>...</p><h2>...</h2>...[IMAGE_1]...","imagePrompts":["Prompt 1 for IMAGE_1","Prompt 2 for IMAGE_2","Prompt 3 for IMAGE_3","Prompt 4 for IMAGE_4","Prompt 5 for IMAGE_5"],"author":"ainos"}

CRITICAL: 
- Include exactly 5 imagePrompts describing what each image should show
- Each prompt should be specific: outfit type, setting, pose, lighting
- Example prompt: "Indian woman in high-waisted wide-leg jeans with tucked white shirt, minimalist studio, hands in pockets, soft natural lighting"
- Raw JSON only. No markdown blocks.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.75,
    max_tokens: 4096,
  });

  const aiResponse = completion.choices[0]?.message?.content;
  if (!aiResponse) return null;
  let jsonStr = aiResponse.trim();
  const cb = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (cb) jsonStr = cb[1].trim();
  else { const m = jsonStr.match(/\{[\s\S]*\}/); if (m) jsonStr = m[0]; }
  try { 
    const parsed = JSON.parse(jsonStr);
    // Ensure imagePrompts exists
    if (!parsed.imagePrompts || !Array.isArray(parsed.imagePrompts)) {
      parsed.imagePrompts = [];
    }
    return parsed;
  } catch {
    jsonStr = jsonStr.replace(/"([^"]*?)\n([^"]*?)"/g, '"$1\\n$2"');
    jsonStr = jsonStr.replace(/,\s*}/g, '}');
    try { 
      const parsed = JSON.parse(jsonStr);
      if (!parsed.imagePrompts || !Array.isArray(parsed.imagePrompts)) {
        parsed.imagePrompts = [];
      }
      return parsed;
    } catch { return null; }
  }
}

function calcReadTime(htmlContent) {
  const wordCount = (htmlContent || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(3, Math.ceil(wordCount / 200));
}

module.exports = router;
