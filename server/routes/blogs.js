const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Groq = require('groq-sdk');

console.log('[blogs.js] Route file loaded successfully');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

// Admin secret for protecting write operations
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'tubhyam_admin_2024';

// ─── Middleware ─────────────────────────────────────────────────────────────────
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Admin access required' });
  }
  const token = authHeader.replace('Bearer ', '');
  const validTokens = [
    ADMIN_SECRET,
    'tubhyam_admin_2024',
    'tubhyam-admin-2024',
  ];
  if (!validTokens.includes(token)) {
    return res.status(401).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// ─── Phase 1: Trend Research ───────────────────────────────────────────────────
router.post('/research-trends', verifyAdmin, async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword || !keyword.trim()) {
      return res.status(400).json({ success: false, message: 'Keyword is required' });
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'Groq API key not configured' });
    }

    const prompt = `You are a fashion trend researcher for the Indian e-commerce market.

Research what's currently trending for "${keyword}" across major Indian and global fashion platforms.

Identify 6-8 specific trending styles, variations, or angles for "${keyword}". For each trend, provide:
1. **trendName**: A short, catchy name for the trend (e.g., "Oversized Cargo Tracks", "Minimalist Slim-Fit Joggers")
2. **sourcePlatform**: Which platform this trend is popular on (e.g., Myntra, Ajio, Zara, Nykaa Fashion, H&M India, Urbanic, SHEIN India, etc.)
3. **whyTrending**: 1-2 sentences explaining WHY this trend is popular right now (celebrity influence, seasonal demand, lifestyle shift, etc.)
4. **suggestedTitle**: A catchy, SEO-friendly article title for a blog post about this trend

Return ONLY valid JSON with this exact structure:
{
  "trends": [
    {
      "trendName": "Trend name here",
      "sourcePlatform": "Platform name",
      "whyTrending": "Why it's trending explanation",
      "suggestedTitle": "Catchy SEO article title"
    }
  ]
}

CRITICAL: Return ONLY the raw JSON object. No markdown code blocks, no extra text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      return res.status(500).json({ success: false, message: 'No response from AI' });
    }

    // Parse JSON from response
    let jsonStr = aiResponse.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    } else {
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) jsonStr = jsonMatch[0];
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      jsonStr = jsonStr.replace(/"([^"]*?)\n([^"]*?)"/g, '"$1\\n$2"');
      parsed = JSON.parse(jsonStr);
    }

    res.json({
      success: true,
      keyword,
      trends: parsed.trends || [],
    });
  } catch (error) {
    console.error('Error researching trends:', error);
    res.status(500).json({ success: false, message: 'Failed to research trends', error: error.message });
  }
});

// ─── Phase 2: Generate Articles from Trends ────────────────────────────────────
router.post('/generate-from-trends', verifyAdmin, async (req, res) => {
  try {
    const { keyword, trends, publishIntervalHours = 24 } = req.body;

    if (!keyword || !keyword.trim()) {
      return res.status(400).json({ success: false, message: 'Keyword is required' });
    }
    if (!trends || !Array.isArray(trends) || trends.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one trend is required' });
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'Groq API key not configured' });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < trends.length; i++) {
      try {
        const trend = trends[i];

        // Generate high-fidelity image with varied professional style per article
        const imagePrompt = buildHighFidelityImagePrompt(keyword, trend, i);
        const imageUrl = buildImageUrl(imagePrompt, keyword, i);

        // Generate article for this specific trend
        const articleData = await generateArticleFromTrend(keyword, trend);
        if (!articleData) {
          errors.push(`Article ${i + 1} (${trend.trendName}): Failed to generate`);
          continue;
        }

        // Schedule articles publishIntervalHours apart
        const hoursOffset = i * publishIntervalHours;
        const scheduledPublishDate = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
        const readTime = calcReadTime(articleData.content);

        const blog = new Blog({
          title: articleData.title,
          excerpt: articleData.excerpt,
          content: articleData.content,
          category: articleData.category || '',
          keywords: [keyword, trend.trendName, trend.sourcePlatform],
          image: imageUrl,
          author: articleData.author || '',
          readTime,
          status: 'scheduled',
          scheduledPublishDate,
          trendKeyword: keyword,
          trendSource: trend.sourcePlatform,
        });
        await blog.save();

        results.push({
          id: blog._id,
          title: blog.title,
          category: blog.category,
          image: blog.image,
          readTime: blog.readTime,
          scheduledPublishDate: blog.scheduledPublishDate,
          trendName: trend.trendName,
          sourcePlatform: trend.sourcePlatform,
        });
      } catch (err) {
        console.error(`Trend article ${i + 1} failed:`, err.message);
        errors.push(`Article ${i + 1}: ${err.message}`);
      }
    }

    res.json({
      success: true,
      message: `Generated ${results.length} of ${trends.length} articles successfully`,
      articles: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error generating articles from trends:', error);
    res.status(500).json({ success: false, message: 'Failed to generate articles', error: error.message });
  }
});

// ─── Admin Routes ───────────────────────────────────────────────────────────────

// GET /api/blogs/admin/queue - All drafts + scheduled
router.get('/admin/queue', verifyAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find({ status: { $in: ['draft', 'scheduled'] } })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch queue' });
  }
});

// GET /api/blogs/admin/stats - Dashboard stats
router.get('/admin/stats', verifyAdmin, async (req, res) => {
  try {
    const [published, scheduled, draft] = await Promise.all([
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'scheduled' }),
      Blog.countDocuments({ status: 'draft' }),
    ]);
    res.json({ success: true, stats: { published, scheduled, draft, total: published + scheduled + draft } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// ─── Public Routes ──────────────────────────────────────────────────────────────

// GET /api/blogs - List published blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('-content');

    res.json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
});

// GET /api/blogs/:slug - Single blog post
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog' });
  }
});

// POST /api/blogs/:id/publish - Manually publish
router.post('/:id/publish', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    blog.status = 'published';
    blog.publishedAt = new Date();
    blog.scheduledPublishDate = null;
    await blog.save();
    res.json({ success: true, message: 'Blog published successfully', blog });
  } catch (error) {
    console.error('Error publishing blog:', error);
    res.status(500).json({ success: false, message: 'Failed to publish blog' });
  }
});

// DELETE /api/blogs/:id - Delete a blog
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog' });
  }
});

// ─── Faceless Fashion Image Generator ──────────────────────────────────────
// Images DYNAMICALLY match the keyword/trend. NEVER show face.

const KEYWORD_SCENES = {
  // ── Western Wear ──
  'western wear': 'neck-down crop of woman in trendy western outfit with crop top and wide-leg pants, modern studio',
  'western': 'neck-down crop of woman in stylish western wear outfit with bag and heels, urban setting',
  'top': 'neck-down crop of woman in fashionable top with jeans, hands adjusting sleeve, bright studio',
  'crop top': 'neck-down crop of woman in crop top with high-waist jeans, hands on bag, outdoor cafe',
  'shirt': 'neck-down crop of woman in crisp button-down shirt with tailored bottoms, clean studio',
  'blouse': 'neck-down crop of woman in elegant blouse with skirt, hands visible, boutique setting',
  't-shirt': 'neck-down crop of woman in graphic tee with jeans and sneakers, casual urban street',
  // ── Bottoms ──
  'bottom': 'neck-down crop of woman in stylish bottoms with tucked-in top, full outfit visible, studio',
  'formal pants': 'neck-down crop of woman in tailored formal pants with blazer and heels, modern office',
  'trousers': 'neck-down crop of woman in structured trousers with elegant top, professional studio',
  'palazzo': 'neck-down crop of woman in flowing palazzo pants with fitted top, breezy outdoor terrace',
  'wide leg': 'neck-down crop of woman in wide-leg pants with tucked-in blouse, modern studio',
  'pant': 'neck-down crop of woman in perfectly fitted pants with stylish top, clean background',
  'cargo': 'neck-down crop of woman in cargo pants with crop top and sneakers, urban street',
  'track pants': 'neck-down crop of woman in stylish track pants with fitted top and sneakers, outdoor setting',
  'tracks': 'neck-down crop of woman in coordinated track suit with sneakers, sporty outdoor setting',
  'jogger': 'neck-down crop of woman in slim joggers with oversized sweatshirt and sneakers, park setting',
  'legging': 'neck-down crop of woman in high-waist leggings with long top and sneakers, gym studio',
  // ── Jeans & Denim ──
  'jeans': 'neck-down crop of woman in perfect-fit jeans with stylish top and belt, urban street',
  'denim': 'neck-down crop of woman in denim outfit with jeans and jacket, hands in pockets, street style',
  'wide leg jeans': 'neck-down crop of woman in wide-leg jeans with tucked-in top and heels, boutique',
  'mom jeans': 'neck-down crop of woman in high-waist mom jeans with crop top and sneakers, cafe',
  'skinny jeans': 'neck-down crop of woman in skinny jeans with oversized blazer and boots, city street',
  'straight jeans': 'neck-down crop of woman in straight-leg jeans with classic white shirt, studio',
  'boyfriend jeans': 'neck-down crop of woman in relaxed boyfriend jeans with fitted top and heels, street',
  // ── Casual ──
  'casual': 'neck-down crop of woman in relaxed casual outfit with jeans and sneakers, outdoor cafe',
  'casual pants': 'neck-down crop of woman in comfortable casual pants with soft top, relaxed setting',
  'ootd': 'neck-down crop of woman in perfectly styled outfit of the day, hands on bag, Instagram-worthy setting',
  'outfit of the day': 'neck-down crop of woman in stylish daily outfit with accessories, bright natural lighting',
  'daily wear': 'neck-down crop of woman in chic everyday outfit with crossbody bag, city street',
  // ── Gen Z ──
  'gen z': 'neck-down crop of woman in gen-z trendy outfit with baggy jeans and crop top, neon studio',
  'genz': 'neck-down crop of woman in youthful trendy outfit with layered accessories, modern street',
  'y2k': 'neck-down crop of woman in Y2K-inspired outfit with low-rise jeans and baby tee, retro studio',
  'streetwear': 'neck-down crop of woman in oversized streetwear with baggy pants and chunky sneakers, graffiti wall',
  'aesthetic': 'neck-down crop of woman in aesthetic outfit with coordinated layers and accessories, dreamy setting',
  'coquette': 'neck-down crop of woman in coquette aesthetic outfit with lace and pearls, soft pink studio',
  // ── Collection & Seasonal ──
  'collection': 'neck-down crop of woman modeling latest fashion collection piece, editorial studio',
  'new arrival': 'neck-down crop of woman in fresh new-season outfit with statement piece, bright studio',
  'summer': 'neck-down crop of woman in light summer outfit with sandals and tote, sunny outdoor',
  'winter': 'neck-down crop of woman in cozy winter layers with scarf and boots, warm indoor setting',
  'spring': 'neck-down crop of woman in fresh spring outfit with pastel colors, garden setting',
  // ── Ethnic & Fusion ──
  'ethnic': 'neck-down crop of woman in fusion ethnic-western outfit with jhumkas, art gallery setting',
  'kurta': 'neck-down crop of woman in modern kurta with jeans and juttis, bright patio',
  'saree': 'neck-down crop of woman in modern saree drape with heels, elegant venue',
  'suit': 'neck-down crop of woman in tailored suit with structured shoulders, corporate lobby',
  // ── Accessories & Styling ──
  'style': 'neck-down crop of woman styling outfit with hands adjusting blazer, bright studio',
  'accessorize': 'neck-down crop of woman hands styling jewelry bag and shoes on marble surface, boutique',
  'jewelry': 'neck-down crop of woman hands wearing bangles and rings with outfit, soft lighting',
  'shoe': 'neck-down crop of woman feet in stylish heels with outfit visible, boutique floor',
  'bag': 'neck-down crop of woman carrying designer bag with complete outfit, city street',
  // ── Trends & Categories ──
  'trend': 'neck-down crop of woman in trendy 2025 fashion with statement accessories, modern studio',
  'wardrobe': 'neck-down crop of woman selecting clothes from curated capsule wardrobe, clean white closet',
  'occasion': 'neck-down crop of woman in elegant occasion wear with clutch and heels, luxury venue',
  'season': 'neck-down crop of woman in layered seasonal outfit with scarf and boots, outdoor garden',
  'body type': 'neck-down crop of woman in perfectly fitted flattering outfit, studio with warm backdrop',
  'color': 'neck-down crop of woman in bold color-coordinated outfit with matching accessories, vibrant background',
  'fabric': 'neck-down crop of woman touching premium fabric texture, design studio with swatches',
  'budget': 'neck-down crop of woman holding shopping bags with stylish outfit, city street',
  'travel': 'neck-down crop of woman in travel-ready outfit with tote and sunglasses, airport lounge',
  'sustainable': 'neck-down crop of woman in eco-friendly cotton outfit, natural green setting',
  'blazer': 'neck-down crop of woman in structured blazer outfit with hands in pockets, office lobby',
  'dress': 'neck-down crop of woman in elegant dress with heels and clutch, evening setting',
  'festival': 'neck-down crop of woman in festive outfit with bangles and clutch, decorated venue',
  'office wear': 'neck-down crop of woman in modern professional outfit with laptop bag, corporate space',
  'workwear': 'neck-down crop of woman in modern professional outfit with laptop bag, corporate space',
  'party': 'neck-down crop of woman in glamorous party outfit with metallic heels and clutch, nightlife venue',
  'beige': 'neck-down crop of woman in elegant beige-toned outfit with matching accessories, neutral studio',
  'black': 'neck-down crop of woman in all-black outfit with statement accessories, sleek modern studio',
  'white': 'neck-down crop of woman in fresh all-white outfit with gold accessories, bright sunlit studio',
  'cotton': 'neck-down crop of woman in soft cotton outfit with natural drape, relaxed setting',
  'linen': 'neck-down crop of woman in premium linen outfit with relaxed fit, airy bright room',
  'formal': 'neck-down crop of woman in tailored formal outfit with structured bag, professional setting',
};

const DEFAULT_SCENE = 'neck-down crop of stylish Indian woman in chic outfit, hands visible, clean studio';

function getSceneForKeyword(keyword) {
  if (!keyword) return DEFAULT_SCENE;
  const lower = keyword.toLowerCase();
  const keys = Object.keys(KEYWORD_SCENES);
  for (const key of keys) {
    if (lower.indexOf(key) !== -1) return KEYWORD_SCENES[key];
  }
  return DEFAULT_SCENE;
}

function buildHighFidelityImagePrompt(keyword, trend, styleIndex) {
  const scene = getSceneForKeyword(keyword);
  return `Fashion editorial photography, ${scene}, NO FACE VISIBLE, faceless, cropped at chin, show outfit hands and body only, natural lighting, photorealistic, warm tones, clean composition, magazine quality, no text, no watermark`;
}

function buildImageUrl(prompt, keyword, index) {
  const seed = `tubhyam-${keyword.replace(/\s+/g, '-')}-${index}-${Math.floor(Math.random() * 99999)}`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&seed=${seed}&nologo=true&model=flux`;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

async function generateArticleFromTrend(keyword, trend) {
  const prompt = `You are an expert SEO content writer. Write a comprehensive, engaging blog article about this specific fashion trend:

**Keyword**: ${keyword}
**Trend Name**: ${trend.trendName}
**Platform**: ${trend.sourcePlatform}
**Why It's Trending**: ${trend.whyTrending}
**Suggested Title**: ${trend.suggestedTitle}

Requirements:
- Title: Use the suggested title or improve it. SEO-optimized, max 65 characters.
- Excerpt: Compelling summary, max 140 characters with a call-to-action feel.
- Category: Choose a relevant category (e.g., Fashion Trends, Styling Guide, Trend Report, etc.)
- Content: 800-1200 words in clean HTML. Use <h2> for headings, <p> for paragraphs, <ul>/<li> for lists, <strong> for emphasis. No markdown.
- SEO: Use "${keyword}" and "${trend.trendName}" naturally throughout. Mention "${trend.sourcePlatform}" as the source of this trend.
- GEO (Generative Engine Optimization): Include concise, quotable definitions (1-2 sentences) that AI engines can extract.
- AEO (Answer Engine Optimization): Include a FAQ section at the end using <h2>FAQ</h2> followed by <h3> questions and <p> answers.
- Tone: Professional yet friendly, targeting fashion-conscious readers.
- Do NOT include any specific pricing or product IDs.

Return ONLY valid JSON with this exact structure:
{"title":"Your SEO title","excerpt":"Your compelling excerpt","category":"Chosen category","content":"<h2>Heading</h2><p>Paragraph...</p>","author":"ianos"}

CRITICAL: Return ONLY the raw JSON object. No markdown code blocks, no extra text, no actual newlines inside strings (use \\n if needed).`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4096,
  });

  const aiResponse = completion.choices[0]?.message?.content;
  if (!aiResponse) return null;

  // Parse JSON from response
  let jsonStr = aiResponse.trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  } else {
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];
  }

  try {
    return JSON.parse(jsonStr);
  } catch {
    jsonStr = jsonStr.replace(/"([^"]*?)\n([^"]*?)"/g, '"$1\\n$2"');
    return JSON.parse(jsonStr);
  }
}

function calcReadTime(htmlContent) {
  const wordCount = htmlContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(3, Math.ceil(wordCount / 200));
}

// ─── Batch Generate: Multiple keywords at once ────────────────────────────────
router.post('/generate-batch', verifyAdmin, async (req, res) => {
  try {
    const { keywords, articlesPerKeyword = 2, publishIntervalHours = 20 } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one keyword is required' });
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'Groq API key not configured' });
    }

    const results = [];
    const errors = [];
    let globalIndex = 0;

    for (let k = 0; k < keywords.length; k++) {
      const keyword = keywords[k].trim();
      if (!keyword) continue;

      for (let a = 0; a < articlesPerKeyword; a++) {
        try {
          globalIndex++;
          const articleData = await generateArticleFromKeyword(keyword, a);
          if (!articleData) {
            errors.push(`Keyword "${keyword}" article ${a + 1}: Failed to generate`);
            continue;
          }

          // Dynamic image based on keyword
          const imagePrompt = buildHighFidelityImagePrompt(keyword, null, globalIndex);
          const imageUrl = buildImageUrl(imagePrompt, keyword, globalIndex);

          const hoursOffset = globalIndex * publishIntervalHours;
          const scheduledPublishDate = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
          const readTime = calcReadTime(articleData.content || '');

          const blog = new Blog({
            title: articleData.title,
            excerpt: articleData.excerpt,
            content: articleData.content,
            category: articleData.category || '',
            keywords: [keyword],
            image: imageUrl,
            author: articleData.author || 'ianos',
            readTime,
            status: 'scheduled',
            scheduledPublishDate,
            trendKeyword: keyword,
            trendSource: 'batch-generation',
          });
          await blog.save();

          results.push({
            id: blog._id,
            title: blog.title,
            keyword,
            image: blog.image,
            scheduledPublishDate: blog.scheduledPublishDate,
          });

          // Rate limit delay (3s between articles)
          await new Promise(r => setTimeout(r, 3000));
        } catch (err) {
          console.error(`Batch article failed (${keyword} #${a + 1}):`, err.message);
          errors.push(`"${keyword}" article ${a + 1}: ${err.message}`);
        }
      }
    }

    res.json({
      success: true,
      message: `Generated ${results.length} of ${keywords.length * articlesPerKeyword} articles`,
      articles: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Batch generation error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate batch', error: error.message });
  }
});

// Generate a standalone article from a keyword (no trend research needed)
async function generateArticleFromKeyword(keyword, variation) {
  const variations = [
    `Write a comprehensive buying guide for "${keyword}" — what to look for, best styles, how to choose, how to style them.`,
    `Write a styling guide for "${keyword}" — outfit ideas, what to pair with, day vs night looks, common mistakes to avoid.`,
    `Write a trend report on "${keyword}" — what's trending in 2025, popular styles on Myntra/Ajio/Zara, celebrity-inspired looks.`,
    `Write an occasion guide for "${keyword}" — what to wear where, how to dress up or down, budget vs premium options.`,
  ];

  const angle = variations[variation % variations.length];

  const prompt = `You are an expert SEO content writer for Tubhyam (tubhyam.in), a premium Indian women's fashion brand.

${angle}

Keyword: "${keyword}"
Target audience: Indian women 20-40.

Requirements:
- Title: SEO-optimized, max 65 characters, include "${keyword}" naturally.
- Excerpt: Compelling summary, max 140 characters.
- Category: Choose from: Fashion Trends, Styling Guide, Buying Guide, Trend Report, Outfit Ideas.
- Content: 1000-1500 words in clean HTML. Use <h2>, <h3>, <p>, <ul>/<li>, <strong>. No markdown.
- SEO: Use "${keyword}" 5-7 times naturally. Include related terms.
- GEO: Include quotable definitions AI engines can extract.
- AEO: FAQ section with <h2>FAQ</h2> then <h3> questions and <p> answers.
- Internal link: <a href="/products">Explore Tubhyam's collection</a>
- Mention Tubhyam 2 times naturally.
- NO pricing or product IDs.

Return ONLY valid JSON:
{"title":"...","excerpt":"...","category":"...","content":"<h2>...</h2><p>...</p>","author":"ianos"}

CRITICAL: Raw JSON only. No markdown blocks. No newlines inside strings (use \\n).`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4096,
  });

  const aiResponse = completion.choices[0]?.message?.content;
  if (!aiResponse) return null;

  let jsonStr = aiResponse.trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();
  else {
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];
  }

  try {
    return JSON.parse(jsonStr);
  } catch {
    jsonStr = jsonStr.replace(/"([^"]*?)\n([^"]*?)"/g, '"$1\\n$2"');
    jsonStr = jsonStr.replace(/,\s*}/g, '}');
    try { return JSON.parse(jsonStr); } catch { return null; }
  }
}

module.exports = router;
