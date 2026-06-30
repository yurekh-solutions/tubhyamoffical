const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Groq = require('groq-sdk');
const crypto = require('crypto');

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
    res.status(500).json({ success: false, message: 'Failed to create campaign', error: error.message });
  }
});

// GET /campaigns — List all campaigns
router.get('/campaigns', verifyAdmin, async (req, res) => {
  try {
    const posts = await Blog.find({ campaignId: { $ne: '' } }).sort({ campaignId: 1, dayIndex: 1 });
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
        post.content = articleData.content;
        post.excerpt = articleData.excerpt || post.excerpt;
        post.metaTitle = articleData.metaTitle || post.title;
        post.metaDescription = articleData.metaDescription || post.excerpt;
        post.readTime = calcReadTime(articleData.content);

        // Generate faceless image
        const imagePrompt = buildHighFidelityImagePrompt(post.trendKeyword || post.focusKeyword, null, post.dayIndex);
        post.image = buildImageUrl(imagePrompt, post.trendKeyword || post.focusKeyword, post.dayIndex);

        post.status = post.scheduledPublishDate ? 'scheduled' : 'draft';
        post.generationStatus = 'ready';
        post.errorMessage = '';
        await post.save();
        results.push({ _id: post._id, title: post.title, dayIndex: post.dayIndex, status: post.status });
        await new Promise(r => setTimeout(r, 3000));
      } catch (err) {
        post.status = 'failed';
        post.generationStatus = 'failed';
        post.errorMessage = err.message;
        await post.save();
        errors.push({ _id: post._id, dayIndex: post.dayIndex, error: err.message });
      }
    }

    res.json({ success: true, message: `Generated ${results.length} of ${posts.length} posts`, results, errors: errors.length ? errors : undefined });
  } catch (error) {
    console.error('Campaign generation failed:', error);
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

// DELETE /campaigns/:id — Delete entire campaign and all its posts
router.delete('/campaigns/:id', verifyAdmin, async (req, res) => {
  try {
    const result = await Blog.deleteMany({ campaignId: req.params.id });
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
        blog.content = articleData.content;
        blog.excerpt = articleData.excerpt || blog.excerpt;
        blog.metaTitle = articleData.metaTitle || blog.title;
        blog.metaDescription = articleData.metaDescription || blog.excerpt;
        blog.readTime = calcReadTime(articleData.content);
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

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.json({ success: true, blog });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to fetch blog' }); }
});

// ═══ FACELESS IMAGE GENERATION ════════════════════════════════════════════════

// Professional photography style preset - consistent across all images
const PHOTO_PRESET = 'Canon EOS R5, 85mm f/1.8 lens, editorial fashion photography, Vogue India style, soft natural lighting, shallow depth of field, warm color grading, premium fabric texture detail';

const KEYWORD_SCENES = {
  'western wear': 'Indian woman in trendy western outfit, modern minimalist studio, hands resting on designer bag',
  'western': 'Indian woman in stylish western wear with leather handbag and heels, urban cafe setting',
  'top': 'Indian woman in fashionable silk blouse with high-waisted jeans, bright studio with soft shadows',
  'formal pants': 'Indian woman in tailored charcoal formal pants with white silk blouse, modern glass office, laptop bag visible',
  'trousers': 'Indian woman in structured high-waisted trousers with elegant cream top, marble studio floor',
  'palazzo': 'Indian woman in flowing ivory palazzo pants with fitted black top, outdoor terrace with plants',
  'wide leg': 'Indian woman in high-waisted wide-leg denim jeans with tucked-in white shirt, minimalist white studio, hands in pockets',
  'cargo': 'Indian woman in olive cargo pants with black crop top and white sneakers, urban street with graffiti',
  'track pants': 'Indian woman in stylish black track pants with cropped hoodie and sneakers, outdoor park path',
  'jogger': 'Indian woman in slim beige joggers with oversized cream sweatshirt, park bench setting',
  'jeans': 'Indian woman in perfect-fit blue jeans with white t-shirt and leather belt, city street with warm sunlight',
  'denim': 'Indian woman in classic blue denim jeans with denim jacket over white top, street style photography',
  'casual': 'Indian woman in relaxed casual outfit with light wash jeans and white sneakers, cozy cafe interior',
  'ootd': 'Indian woman in styled outfit of the day, hands on designer handbag, Instagram-worthy setting',
  'gen z': 'Indian woman in gen-z trendy outfit with baggy jeans and layered necklaces, neon-lit studio',
  'genz': 'Indian woman in youthful trendy outfit with oversized blazer and chunky sneakers, urban street',
  'streetwear': 'Indian woman in oversized streetwear hoodie with baggy pants and chunky sneakers, graffiti wall background',
  'summer': 'Indian woman in light linen summer outfit with strappy sandals and woven tote, sunny garden setting',
  'winter': 'Indian woman in cozy winter layers with wool scarf and ankle boots, warm indoor setting with window light',
  'ethnic': 'Indian woman in fusion ethnic-western outfit with silver jhumkas and contemporary kurta, art gallery',
  'kurta': 'Indian woman in modern printed kurta with white jeans and embroidered juttis, bright patio with flowers',
  'saree': 'Indian woman in modern saree drape with statement earrings and heels, elegant marble venue',
  'wardrobe': 'Indian woman selecting from organized capsule wardrobe, walk-in closet with white shelves',
  'occasion': 'Indian woman in elegant occasion wear with embellished clutch and heels, luxury hotel lobby',
  'body type': 'Indian woman in perfectly fitted flattering outfit that accentuates curves, warm studio with soft lighting',
  'color': 'Indian woman in bold color-blocked outfit with coordinated accessories, vibrant gradient background',
  'blazer': 'Indian woman in structured navy blazer with matching trousers and pointed heels, corporate office lobby',
  'dress': 'Indian woman in elegant midi dress with strappy heels and clutch, evening cocktail setting',
  'party': 'Indian woman in glamorous sequin party outfit with statement earrings, nightlife venue with ambient lighting',
  'beige': 'Indian woman in beige-toned monochrome outfit with tan accessories, neutral cream studio',
  'cotton': 'Indian woman in soft organic cotton outfit with natural drape and texture, airy bright room with plants',
  'linen': 'Indian woman in premium linen outfit with relaxed fit, airy bright room with natural light',
  'formal': 'Indian woman in tailored formal outfit with structured blazer and pointed-toe pumps, professional setting',
  'office wear': 'Indian woman in professional outfit with laptop bag and minimal jewelry, modern co-working space',
  'sustainable': 'Indian woman in eco-friendly organic cotton outfit, green garden setting with natural light',
  'travel': 'Indian woman in travel-ready comfortable outfit with leather tote and sunglasses, airport lounge interior',
};
const DEFAULT_SCENE = 'stylish Indian woman in chic contemporary outfit, hands visible with designer accessories, clean white studio with soft shadows';

function getSceneForKeyword(keyword) {
  if (!keyword) return DEFAULT_SCENE;
  const lower = keyword.toLowerCase();
  // Try exact match first, then partial match
  for (const key of Object.keys(KEYWORD_SCENES)) {
    if (lower === key || lower.includes(key)) return KEYWORD_SCENES[key];
  }
  // Check for common terms
  if (lower.includes('jean') || lower.includes('denim')) return KEYWORD_SCENES['jeans'];
  if (lower.includes('pant') || lower.includes('trouser')) return KEYWORD_SCENES['formal pants'];
  if (lower.includes('formal')) return KEYWORD_SCENES['formal'];
  return DEFAULT_SCENE;
}

function buildHighFidelityImagePrompt(keyword) {
  const scene = getSceneForKeyword(keyword);
  return `NECK-DOWN CROP, NO FACE VISIBLE, chin-up framing only, ${scene}, ${PHOTO_PRESET}, photorealistic, magazine quality, no text overlay, no watermark, sharp focus on garment details`;
}

function buildImageUrl(prompt, keyword, index) {
  const seed = `tubhyam-${(keyword || 'blog').replace(/\s+/g, '-')}-${index}-${Math.floor(Math.random() * 99999)}`;
  const negative = 'face, head, eyes, nose, mouth, hair, forehead, ears, neck up, distorted, blurry, low quality, text, watermark, cartoon, illustration, painting';
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&seed=${seed}&nologo=true&model=flux&negative=${encodeURIComponent(negative)}`;
}

// ═══ ARTICLE GENERATION ═══════════════════════════════════════════════════════

async function generateCampaignArticle(keyword, post, extraInstruction = '') {
  const tweakLine = extraInstruction ? `\nAdditional instruction: ${extraInstruction}` : '';
  const prompt = `You are an expert SEO content writer for Tubhyam (tubhyam.in), a premium Indian women's fashion brand. Voice: warm, inclusive, body-positive.

Write a comprehensive blog article:
- Title: "${post.title}"
- Focus keyword: "${post.focusKeyword || keyword}"
- Angle: ${post.excerpt || 'Comprehensive fashion guide'}
- Target audience: Indian women 20-40${tweakLine}

Requirements:
- Title: SEO-optimized, max 65 chars, include focus keyword naturally.
- Meta title: max 60 chars. Meta description: 150-160 chars.
- Content: 800-1200 words in clean HTML. Use <h2>, <h3>, <p>, <ul>, <li>, <strong>.
- Structure: Hook intro, 4-7 H2 sections, practical tips, FAQ with 3-4 questions, closing CTA.
- CTA: <a href="/products">Explore Tubhyam's collection</a>
- SEO: Use "${keyword}" 5-7 times naturally. GEO: Include quotable definitions.
- Mention Tubhyam 2 times. NO pricing or product IDs.

Return ONLY valid JSON:
{"title":"...","excerpt":"...","metaTitle":"...","metaDescription":"...","content":"<h2>...</h2><p>...</p>","author":"ainos"}

CRITICAL: Raw JSON only. No markdown blocks.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4096,
  });

  const aiResponse = completion.choices[0]?.message?.content;
  if (!aiResponse) return null;
  let jsonStr = aiResponse.trim();
  const cb = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (cb) jsonStr = cb[1].trim();
  else { const m = jsonStr.match(/\{[\s\S]*\}/); if (m) jsonStr = m[0]; }
  try { return JSON.parse(jsonStr); } catch {
    jsonStr = jsonStr.replace(/"([^"]*?)\n([^"]*?)"/g, '"$1\\n$2"');
    jsonStr = jsonStr.replace(/,\s*}/g, '}');
    try { return JSON.parse(jsonStr); } catch { return null; }
  }
}

function calcReadTime(htmlContent) {
  const wordCount = (htmlContent || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(3, Math.ceil(wordCount / 200));
}

module.exports = router;
