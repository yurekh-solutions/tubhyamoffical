const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Groq = require('groq-sdk');
const { createApi } = require('unsplash-js');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

// Unsplash API (free tier, no key needed for demo/public access)
// Using a public demo key for basic searches
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || 'demo-key'
});

// Admin secret for protecting write operations
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'tubhyam-admin-2024';

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(401).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// GET /api/blogs - List published blogs (public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('-content'); // Don't send full content in list
    
    res.json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
});

// GET /api/blogs/:slug - Single blog post (public)
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog' });
  }
});

// GET /api/blogs/admin/queue - Admin view: all drafts + scheduled (protected)
router.get('/admin/queue', verifyAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find({ status: { $in: ['draft', 'scheduled'] } })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch queue' });
  }
});

// POST /api/blogs/generate - AI generates article (protected)
router.post('/generate', verifyAdmin, async (req, res) => {
  try {
    const { keywords } = req.body;
    
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Keywords array is required' 
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Groq API key not configured' 
      });
    }

    // Generate article content with Groq
    const prompt = `You are an expert SEO content writer for Tubhyam, a premium Indian women's fashion brand specializing in formal pants, jeans, and track pants.

Write a comprehensive, SEO-optimized blog article based on these keywords: ${keywords.join(', ')}

Requirements:
- Title: Catchy, SEO-friendly (max 70 characters)
- Excerpt: Compelling summary (max 150 characters)
- Category: Choose from: Fashion Tips, Styling, Trends, Sustainability, Craftsmanship
- Content: 800-1200 words, well-structured with H2 headings, bullet points where appropriate
- Tone: Professional yet friendly, targeting Indian women aged 20-40
- Include specific Tubhyam product mentions where relevant
- Optimize for SEO, GEO (Generative Engine Optimization), and AEO (Answer Engine Optimization)
- Include a FAQ section at the end with 3-4 common questions

Return ONLY valid JSON with this exact structure:
{
  "title": "Your SEO-optimized title",
  "excerpt": "Your compelling excerpt",
  "category": "Chosen category",
  "content": "Full article content in HTML format with <h2>, <p>, <ul>, <li> tags"
}

Do not include any other text, just the JSON.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate article content' 
      });
    }

    // Parse AI response
    let articleData;
    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = aiResponse;
      
      // Remove markdown code block wrappers if present
      const codeBlockMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
      } else {
        // Fallback: extract JSON object
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        }
      }
      
      articleData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to parse AI generated content',
        raw: aiResponse.substring(0, 500)
      });
    }

    // Fetch image from Unsplash
    let imageUrl = '';
    try {
      if (process.env.UNSPLASH_ACCESS_KEY && process.env.UNSPLASH_ACCESS_KEY !== 'demo-key') {
        const searchResult = await unsplash.search.getPhotos({
          query: keywords[0],
          perPage: 1,
          orientation: 'landscape'
        });
        
        if (searchResult.response?.results?.[0]) {
          imageUrl = searchResult.response.results[0].urls.regular;
        }
      }
    } catch (imgError) {
      console.warn('Failed to fetch Unsplash image:', imgError.message);
      // Continue without image
    }

    // Calculate scheduled publish date (18-24 hours from now)
    const hoursToAdd = 18 + Math.random() * 6; // Random between 18-24 hours
    const scheduledPublishDate = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000);

    // Calculate read time (roughly 200 words per minute)
    const wordCount = articleData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.max(3, Math.ceil(wordCount / 200));

    // Create blog post
    const blog = new Blog({
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      category: articleData.category || 'Fashion Tips',
      keywords,
      image: imageUrl,
      readTime,
      status: 'scheduled',
      scheduledPublishDate
    });

    await blog.save();

    res.json({
      success: true,
      message: 'Article generated and scheduled for publishing',
      blog: {
        id: blog._id,
        title: blog.title,
        excerpt: blog.excerpt,
        category: blog.category,
        scheduledPublishDate: blog.scheduledPublishDate,
        readTime: blog.readTime
      }
    });

  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate article',
      error: error.message 
    });
  }
});

// POST /api/blogs/:id/publish - Manually publish a draft (protected)
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
    
    res.json({
      success: true,
      message: 'Blog published successfully',
      blog
    });
  } catch (error) {
    console.error('Error publishing blog:', error);
    res.status(500).json({ success: false, message: 'Failed to publish blog' });
  }
});

// DELETE /api/blogs/:id - Delete a blog (protected)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    
    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog' });
  }
});

module.exports = router;
