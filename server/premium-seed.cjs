/**
 * Premium Blog Seeder - AI articles (2000+ words) + Lovable-quality images
 * Run: node tubhyamoffical/server/premium-seed.cjs
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const Blog = require('./models/Blog');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Faceless Fashion Image Generator ──────────────────────────────────────
// Images are DYNAMICALLY built from the article's keyword/category.
// NEVER show face. Crop from neck down. Show outfit + background only.

// Keyword-to-visual-scene mapping — images match the article topic
var KEYWORD_SCENES = {
  'style': 'neck-down crop of woman styling outfit with hands adjusting blazer, bright studio',
  'trend': 'neck-down crop of woman in trendy 2025 fashion with statement accessories, modern studio',
  'wardrobe': 'neck-down crop of woman selecting clothes from curated capsule wardrobe, clean white closet',
  'occasion': 'neck-down crop of woman in elegant occasion wear with clutch and heels, luxury venue',
  'accessorize': 'neck-down crop of woman hands styling jewelry bag and shoes on marble surface, boutique',
  'season': 'neck-down crop of woman in layered seasonal outfit with scarf and boots, outdoor garden',
  'body type': 'neck-down crop of woman in perfectly fitted flattering outfit, studio with warm backdrop',
  'ethnic': 'neck-down crop of woman in fusion ethnic-western outfit with jhumkas, art gallery setting',
  'color': 'neck-down crop of woman in bold color-coordinated outfit with matching accessories, vibrant background',
  'formal': 'neck-down crop of woman in tailored formal pants with blazer, modern office',
  'casual': 'neck-down crop of woman in relaxed jeans and top with sneakers, outdoor cafe',
  'fabric': 'neck-down crop of woman touching premium fabric texture, design studio with swatches',
  'budget': 'neck-down crop of woman holding shopping bags with stylish outfit, city street',
  'shoe': 'neck-down crop of woman feet in stylish heels with outfit visible, boutique floor',
  'jewelry': 'neck-down crop of woman hands wearing bangles and rings with outfit, soft lighting',
  'travel': 'neck-down crop of woman in travel-ready outfit with tote and sunglasses, airport lounge',
  'monsoon': 'neck-down crop of woman in rain-ready dark outfit with umbrella, covered outdoor area',
  'layering': 'neck-down crop of woman in layered outfit with cardigan and scarf, cozy indoor setting',
  'kurta': 'neck-down crop of woman in modern kurta with jeans and juttis, bright patio',
  'dress': 'neck-down crop of woman in elegant dress with heels and clutch, evening setting',
  'jeans': 'neck-down crop of woman in perfect-fit jeans with stylish top, urban street',
  'blazer': 'neck-down crop of woman in structured blazer outfit with hands in pockets, office lobby',
  'sustainable': 'neck-down crop of woman in eco-friendly cotton outfit, natural green setting',
  'fusion': 'neck-down crop of woman in indo-western fusion outfit, heritage building',
  'myths': 'neck-down crop of woman confidently breaking fashion rules, creative studio',
  'shopping': 'neck-down crop of woman browsing clothing rack with curated selections, boutique',
  'forecast': 'neck-down crop of woman in futuristic fashion-forward outfit, sleek modern studio',
  'confidence': 'neck-down crop of woman power-walking in confident outfit, city street',
  'workwear': 'neck-down crop of woman in modern professional outfit with laptop bag, corporate space',
  'festival': 'neck-down crop of woman in festive outfit with bangles and clutch, decorated venue',
};

var DEFAULT_SCENE = 'neck-down crop of stylish Indian woman in chic outfit, hands visible, clean studio';

function getSceneForKeyword(keyword) {
  if (!keyword) return DEFAULT_SCENE;
  var lower = keyword.toLowerCase();
  var keys = Object.keys(KEYWORD_SCENES);
  for (var i = 0; i < keys.length; i++) {
    if (lower.indexOf(keys[i]) !== -1) {
      return KEYWORD_SCENES[keys[i]];
    }
  }
  return DEFAULT_SCENE;
}

function buildFeaturedImage(keyword, articleTitle, index) {
  var scene = getSceneForKeyword(keyword);
  var prompt = 'Fashion editorial photography, ' + scene + ', NO FACE VISIBLE, faceless, cropped at chin, show outfit hands and body only, natural lighting, photorealistic, warm tones, clean composition, magazine quality, no text, no watermark';
  var seed = 'tubhyam-v4-' + keyword.replace(/\s+/g, '-') + '-' + index + '-' + Math.floor(Math.random() * 99999);
  return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1280&height=720&seed=' + seed + '&nologo=true&model=flux';
}

// Inline images — also dynamic, based on the article keyword
var INLINE_KEYWORD_SCENES = {
  'style': ['outfit flat lay with accessories and shoes on marble surface', 'styling tools including belt scarf and jewelry on clean table'],
  'trend': ['2025 fashion trend mood board with fabric swatches and photos', 'trendy outfit pieces arranged on clothing rack, boutique display'],
  'wardrobe': ['capsule wardrobe essentials neatly organized on wooden rack', 'mix-and-match clothing pieces laid out on bed, flat lay photography'],
  'occasion': ['occasion wear outfit with matching accessories on velvet surface', 'event-ready ensemble with clutch heels and jewelry, editorial flat lay'],
  'accessorize': ['jewelry collection with necklaces earrings and bangles on marble', 'handbags shoes and accessories arranged in boutique display'],
  'season': ['seasonal fashion collection with layers and textures, editorial display', 'weather-appropriate outfit with fabrics and accessories, flat lay'],
  'body type': ['measuring tape with size-inclusive clothing pieces, studio photography', 'flattering outfit options for different silhouettes, clothing rack display'],
  'ethnic': ['ethnic fabric swatches with traditional embroidery, craft photography', 'fusion outfit elements blending Indian and western pieces, flat lay'],
  'color': ['colorful fabric swatches arranged in gradient, creative flat lay', 'color wheel with matching fashion accessories, design studio'],
  'formal': ['formal pants collection with blazers and shirts, boutique display', 'office wear essentials including belt watch and shoes, flat lay'],
  'default': ['fashion styling flat lay with clothes shoes and accessories', 'curated outfit pieces with fabric details and accessories, product photography'],
};

function getInlineScenes(keyword) {
  if (!keyword) return INLINE_KEYWORD_SCENES['default'];
  var lower = keyword.toLowerCase();
  var keys = Object.keys(INLINE_KEYWORD_SCENES);
  for (var i = 0; i < keys.length; i++) {
    if (lower.indexOf(keys[i]) !== -1) {
      return INLINE_KEYWORD_SCENES[keys[i]];
    }
  }
  return INLINE_KEYWORD_SCENES['default'];
}

function buildInlineImage(keyword, articleIndex, j) {
  var scenes = getInlineScenes(keyword);
  var scene = scenes[j % scenes.length];
  var prompt = 'Professional product photography, ' + scene + ', warm natural lighting, sharp focus, clean background, magazine quality, no text, no watermark';
  var seed = 'tubhyam-inline-v4-' + keyword.replace(/\s+/g, '-') + '-' + articleIndex + '-' + j + '-' + Math.floor(Math.random() * 99999);
  return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=768&height=512&seed=' + seed + '&nologo=true&model=flux';
}

// ─── SEO Article Templates ───────────────────────────────────────────────────────
var ARTICLE_CONFIGS = [
  {
    seedTitle: 'How to Style Any Outfit Like a Pro: Complete Guide for Indian Women',
    slug: 'how-to-style-any-outfit-like-pro',
    category: 'Styling Guide',
    targetKeyword: 'how to style outfits',
    secondaryKeywords: ['fashion styling tips', 'outfit ideas Indian women', 'dressing better'],
    promptExtra: 'Cover styling for all types: casual, formal, ethnic, western, fusion. Include tips for office, parties, dates, festivals. Add a "5 styling rules every woman should know" section.',
  },
  {
    seedTitle: 'Fashion Trends 2025: What Every Indian Woman Needs to Know',
    slug: 'fashion-trends-2025-indian-women',
    category: 'Trend Report',
    targetKeyword: 'fashion trends 2025',
    secondaryKeywords: ['2025 fashion trends India', 'latest fashion trends women', 'what to wear 2025'],
    promptExtra: 'Cover all categories: western wear, ethnic wear, accessories, footwear, colors, fabrics. Include trends from Myntra, Ajio, Zara India. Add "trends to avoid" section.',
  },
  {
    seedTitle: '15 Wardrobe Essentials Every Indian Woman Must Have in 2025',
    slug: 'wardrobe-essentials-indian-women-2025',
    category: 'Wardrobe Guide',
    targetKeyword: 'wardrobe essentials',
    secondaryKeywords: ['must have wardrobe items', 'basic wardrobe for women', 'capsule wardrobe India'],
    promptExtra: 'List 15 specific items with why each is essential. Cover: white shirt, little black dress, jeans, formal pants, ethnic kurta, blazer, sneakers, heels, handbag, watch, etc. Include budget tips.',
  },
  {
    seedTitle: 'What to Wear Where: Complete Occasion Dressing Guide',
    slug: 'what-to-wear-where-occasion-guide',
    category: 'Occasion Wear',
    targetKeyword: 'what to wear occasion',
    secondaryKeywords: ['occasion dressing guide', 'what to wear to wedding', 'outfit ideas by occasion'],
    promptExtra: 'Cover 10+ occasions: office, interview, wedding, party, date, festival, casual outing, travel, formal event, brunch. For each: specify exact pieces, colors, and accessories.',
  },
  {
    seedTitle: 'How to Accessorize Any Outfit: Jewelry, Bags, and Shoes Guide',
    slug: 'how-to-accessorize-outfit-jewelry-bags-shoes',
    category: 'Accessories',
    targetKeyword: 'how to accessorize outfits',
    secondaryKeywords: ['fashion accessories guide', 'jewelry styling', 'shoes and bags pairing'],
    promptExtra: 'Cover all accessory types: jewelry (necklace, earrings, bangles), bags (tote, clutch, crossbody), shoes (heels, flats, sneakers). Include day vs night accessorizing. Add skin tone matching.',
  },
  {
    seedTitle: 'Indian Fashion for Every Season: Summer to Winter Style Guide',
    slug: 'indian-fashion-every-season-guide',
    category: 'Seasonal Fashion',
    targetKeyword: 'seasonal fashion India',
    secondaryKeywords: ['summer fashion India', 'winter outfit ideas', 'monsoon dressing'],
    promptExtra: 'Cover all 4 Indian seasons: summer (Mar-Jun), monsoon (Jul-Sep), autumn (Oct-Nov), winter (Dec-Feb). For each: fabrics, colors, layering tips, must-buy items. Include festive season tips.',
  },
  {
    seedTitle: 'Dressing for Your Body Type: Flattering Fashion for Every Indian Woman',
    slug: 'dressing-body-type-flattering-fashion',
    category: 'Body Type Guide',
    targetKeyword: 'dressing for body type',
    secondaryKeywords: ['flattering outfits body type', 'fashion for curvy women', 'petite fashion tips'],
    promptExtra: 'Cover 6 body types: petite, tall, curvy, athletic, apple, pear. For each: best silhouettes, fabrics to choose, styles to avoid. Be body-positive and empowering throughout.',
  },
  {
    seedTitle: 'Ethnic, Western, or Fusion? How to Choose the Right Outfit Every Time',
    slug: 'ethnic-western-fusion-choose-outfit',
    category: 'Style Guide',
    targetKeyword: 'ethnic vs western fashion',
    secondaryKeywords: ['Indo western fusion', 'when to wear ethnic', 'modern Indian fashion'],
    promptExtra: 'Compare all 3 styles with pros/cons. Give occasion-specific recommendations. Include how to create fusion looks from existing wardrobe. Add celebrity style examples.',
  },
  {
    seedTitle: 'The Ultimate Color Guide for Indian Women: What to Wear When',
    slug: 'ultimate-color-guide-indian-women',
    category: 'Color Guide',
    targetKeyword: 'fashion color guide',
    secondaryKeywords: ['what colors to wear', 'colors for skin tone', 'color combinations outfits'],
    promptExtra: 'Include skin tone matching (warm, cool, neutral). Add seasonal color recommendations. Include color psychology for professional settings. Add "power colors for confidence" section.',
  },
];

// ─── Generate Article with Groq ──────────────────────────────────────────────────
async function generateArticle(config, retries) {
  retries = retries || 3;
  var systemPrompt = 'You are an SEO fashion content writer. Write detailed, actionable content for Indian women 20-40.';

  var userPrompt = 'Write a 1500-word blog article in HTML.\n\n' +
    'Title: ' + config.seedTitle + '\n' +
    'Keyword: ' + config.targetKeyword + '\n' +
    'Also use: ' + config.secondaryKeywords.join(', ') + '\n\n' +
    'Requirements:\n' +
    '- 1500+ words, detailed and actionable\n' +
    '- <h2> for sections (5-7), <h3> for subsections, <p> for paragraphs, <ul>/<li> for lists\n' +
    '- ' + config.promptExtra + '\n' +
    '- FAQ section: <h2>FAQ</h2> with 4 <h3> questions + <p> answers\n' +
    '- Link: <a href="/products">Explore Tubhyam collection</a>\n' +
    '- Mention Tubhyam 2 times naturally\n' +
    '- Clean HTML only, no markdown\n' +
    '- No prices or product IDs\n' +
    '- Excerpt: 120 char summary\n\n' +
    'Return JSON only: {"title":"SEO title","excerpt":"120 char summary","content":"<h2>...</h2><p>...</p>"}';

  for (var attempt = 0; attempt < retries; attempt++) {
    try {
      var completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 4096,
      });

      var aiResponse = completion.choices[0].message.content;
      if (!aiResponse) return null;

      // Parse JSON
      var jsonStr = aiResponse.trim();
      var codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
      } else {
        var jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) jsonStr = jsonMatch[0];
      }

      try {
        return JSON.parse(jsonStr);
      } catch (e) {
        jsonStr = jsonStr.replace(/"([^"]*?)\n([^"]*?)"/g, '"$1\\n$2"');
        jsonStr = jsonStr.replace(/\t/g, ' ');
        jsonStr = jsonStr.replace(/,\s*}/g, '}');
        jsonStr = jsonStr.replace(/,\s*]/g, ']');
        try { return JSON.parse(jsonStr); } catch (e2) {}

        // Fallback: extract fields manually
        var titleM = jsonStr.match(/"title"\s*:\s*"([^"]+)"/);
        var excerptM = jsonStr.match(/"excerpt"\s*:\s*"([^"]+)"/);
        var contentM = jsonStr.match(/"content"\s*:\s*"([\s\S]+?)"\s*\}/);
        if (titleM && contentM) {
          return {
            title: titleM[1],
            excerpt: excerptM ? excerptM[1] : config.seedTitle,
            content: contentM[1].replace(/\\n/g, '\n'),
          };
        }
        return null;
      }
    } catch (err) {
      if (err.status === 429 && attempt < retries - 1) {
        var waitTime = err.message.match(/try again in ([\d.]+m)?([\d.]+s)?/);
        var seconds = 30;
        if (waitTime) {
          var mins = waitTime[1] ? parseFloat(waitTime[1]) : 0;
          var secs = waitTime[2] ? parseFloat(waitTime[2]) : 0;
          seconds = Math.ceil(mins * 60 + secs) + 5;
        }
        console.log('    Rate limited, waiting ' + seconds + 's...');
        await new Promise(function(r) { setTimeout(r, seconds * 1000); });
      } else if (attempt < retries - 1) {
        console.log('    Retry ' + (attempt + 1) + '/' + retries + ': ' + err.message);
        await new Promise(function(r) { setTimeout(r, 5000); });
      } else {
        throw err;
      }
    }
  }
  return null;
}

// ─── Inline Image Injection ──────────────────────────────────────────────────────
function injectInlineImages(htmlContent, keyword, topicLabel) {
  var h2Regex = /<\/h2>/gi;
  var matches = Array.from(htmlContent.matchAll(h2Regex));
  if (matches.length < 3) return htmlContent;

  var result = htmlContent;
  var offset = 0;

  // Inject after 2nd, 4th, and 6th </h2> (max 3 inline images)
  var injectAfterIndices = [1, 3, 5];

  for (var j = 0; j < injectAfterIndices.length; j++) {
    var idx = injectAfterIndices[j];
    if (idx >= matches.length) continue;

    var match = matches[idx];
    var insertPos = match.index + match[0].length + offset;

    var imageUrl = buildInlineImage(keyword, 0, j);
    var imgHtml = '<div style="margin:24px 0;border-radius:12px;overflow:hidden;border:1px solid rgba(212,175,55,0.2)"><img src="' + imageUrl + '" alt="' + topicLabel + '" style="width:100%;height:auto;display:block" loading="lazy"></div>';

    result = result.slice(0, insertPos) + imgHtml + result.slice(insertPos);
    offset += imgHtml.length;
  }

  return result;
}

// ─── Word Count ──────────────────────────────────────────────────────────────────
function calcReadTime(html) {
  var words = html.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
}

// ─── Main Seeder ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!\n');

  var existing = await Blog.countDocuments();
  console.log('Found ' + existing + ' existing articles. Will skip existing slugs.\n');

  console.log('Generating premium SEO articles with AI + Lovable-quality images...\n');

  var successCount = 0;

  for (var i = 0; i < ARTICLE_CONFIGS.length; i++) {
    var config = ARTICLE_CONFIGS[i];
    console.log('[' + (i + 1) + '/9] Generating: "' + config.seedTitle + '"...');

    try {
      // Check if article with this slug already exists
      var existingBlog = await Blog.findOne({ slug: config.slug });
      if (existingBlog) {
        console.log('  SKIP: Already exists');
        continue;
      }

      var article = await generateArticle(config);
      if (!article) {
        console.log('  FAILED to generate article');
        continue;
      }

      var wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      var imageUrl = buildFeaturedImage(config.targetKeyword, article.title, i);
      var contentWithImages = injectInlineImages(article.content, config.targetKeyword, config.category);

      var blog = new Blog({
        title: article.title || config.seedTitle,
        slug: config.slug,
        excerpt: article.excerpt || '',
        content: contentWithImages,
        category: config.category,
        keywords: [config.targetKeyword].concat(config.secondaryKeywords),
        image: imageUrl,
        author: 'ianos',
        readTime: calcReadTime(article.content),
        status: 'published',
        publishedAt: new Date(Date.now() - (ARTICLE_CONFIGS.length - i) * 86400000),
      });

      await blog.save();
      successCount++;
      console.log('  PUBLISHED: ' + wordCount + ' words, ' + calcReadTime(article.content) + ' min read');
      console.log('  Image: 1280x720 landscape, Flux model');
      console.log('  Keywords: ' + config.targetKeyword);

      // Small delay between articles to avoid rate limits
      if (i < ARTICLE_CONFIGS.length - 1) {
        await new Promise(function(r) { setTimeout(r, 3000); });
      }
    } catch (err) {
      console.log('  ERROR: ' + err.message);
    }
  }

  console.log('\nDone! ' + successCount + '/9 articles published with premium content + images.');
  console.log('Refresh /blog to see them.\n');

  await mongoose.disconnect();
}

main().catch(function(err) {
  console.error('Fatal error:', err);
  process.exit(1);
});
