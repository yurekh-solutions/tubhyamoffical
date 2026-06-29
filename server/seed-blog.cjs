/**
 * Blog Content Generator - 30 days of articles (Jun 29 - Jul 29)
 * First 9 published NOW, remaining 21 scheduled 1/day
 * Run: node tubhyamoffical/server/seed-blog.cjs
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const Blog = require('./models/Blog');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 30 unique article templates (broad fashion topics for Indian women)
const TOPICS = [
  { label: 'Styling Guide', title: 'How to Style Any Outfit Like a Pro', prompt: 'Write a styling guide for Indian women 20-40. Include 5 golden styling rules, outfit combos for casual/office/party/ethnic. Mention Tubhyam naturally. Add FAQ with 3 questions.' },
  { label: 'Trend Report', title: 'Fashion Trends 2025: What Every Indian Woman Needs to Know', prompt: 'Write a 2025 trend report covering western wear, ethnic wear, accessories, colors, fabrics. Reference Myntra, Ajio trends. Include Tubhyam. Add FAQ with 3 questions.' },
  { label: 'Wardrobe Guide', title: '15 Wardrobe Essentials Every Indian Woman Must Have', prompt: 'Write a capsule wardrobe guide covering white shirt, jeans, formal pants, blazer, kurta, sneakers, heels, bags, etc. 800+ words. Include Tubhyam range. Add FAQ with 4 questions.' },
  { label: 'Occasion Guide', title: 'What to Wear Where: Complete Occasion Dressing Guide', prompt: 'Cover 10 occasions: office, interview, wedding, party, date, festival, brunch, travel, conference, family. For each: exact pieces and accessories. Add FAQ with 3 questions.' },
  { label: 'Accessories', title: 'How to Accessorize Any Outfit: Jewelry, Bags, and Shoes', prompt: 'Write about jewelry (necklace, earrings, bangles), bags (tote, clutch, crossbody), shoes (heels, flats, sneakers). Day vs night. Skin tone matching. Add FAQ with 3 questions.' },
  { label: 'Body Type Guide', title: 'Dressing for Your Body Type: Flattering Fashion for Every Woman', prompt: 'Cover 6 body types: petite, tall, curvy, athletic, apple, pear. Best silhouettes, fabrics, styles to avoid. Be body-positive. Highlight Tubhyam XS-5XL. Add FAQ with 3 questions.' },
  { label: 'Seasonal Fashion', title: 'Indian Fashion for Every Season: Summer to Winter', prompt: 'Cover all 4 Indian seasons: summer, monsoon, autumn, winter. Fabrics, colors, layering tips, must-buy items per season. Add FAQ with 3 questions.' },
  { label: 'Style Guide', title: 'Ethnic, Western, or Fusion? How to Choose the Right Outfit', prompt: 'Compare ethnic, western, and fusion styles with pros/cons. Occasion-specific recommendations. How to create fusion looks. Celebrity examples. Add FAQ with 3 questions.' },
  { label: 'Color Guide', title: 'The Ultimate Color Guide for Indian Women', prompt: 'Cover skin tone matching (warm, cool, neutral). Seasonal color palettes. Power colors for confidence. Color combination formulas. Add FAQ with 3 questions.' },
  { label: 'Budget Fashion', title: 'How to Build a Great Wardrobe on Any Budget', prompt: 'Guide for students, professionals, executives. How to shop sales, invest in staples, mix high-low. Feature Tubhyam value. Add FAQ with 3 questions.' },
  { label: 'Fabric Guide', title: 'Best Fabrics for Indian Climate: A Complete Guide', prompt: 'Compare cotton, linen, silk, polyester, rayon, wool blends. Pros/cons for Indian climate. When to wear what. Add FAQ with 3 questions.' },
  { label: 'Office Wear', title: 'Modern Office Wear Guide for Indian Women', prompt: 'Cover corporate, business casual, creative office, startup culture dress codes. Specific outfit formulas for each. Tubhyam versatility. Add FAQ with 3 questions.' },
  { label: 'Sustainable Fashion', title: 'Sustainable Fashion: Look Great While Saving the Planet', prompt: 'Eco-friendly fabrics, slow fashion, thrifting, upcycling. Quality over quantity. How to shop sustainably in India. Add FAQ with 3 questions.' },
  { label: 'Shoe Guide', title: 'The Complete Shoe Guide: What to Wear with Every Outfit', prompt: 'Cover sneakers, heels, flats, juttis, boots, sandals. Which shoes go with which outfits. Day vs night shoe rules. Add FAQ with 3 questions.' },
  { label: 'Travel Style', title: 'Travel-Friendly Fashion: Look Great Anywhere', prompt: 'Wrinkle-resistant fabrics, packing tips, versatile pieces. Airport to destination looks. Capsule travel wardrobe. Add FAQ with 3 questions.' },
  { label: 'Indian Ethnic', title: 'Modern Indian Ethnic Wear: Beyond the Traditional Saree', prompt: 'Cover kurtas, anarkalis, palazzo suits, lehengas, Indo-western fusion. How to style ethnic wear for modern occasions. Add FAQ with 3 questions.' },
  { label: 'Festive Fashion', title: 'Festive Fashion Guide: What to Wear for Every Indian Festival', prompt: 'Diwali, Eid, Navratri, Holi, Christmas, New Year. Specific outfit + accessory formulas for each. Fusion options. Add FAQ with 3 questions.' },
  { label: 'Confidence Guide', title: 'How the Right Outfit Boosts Your Confidence', prompt: 'Psychology of dressing well, power dressing, self-expression. How fashion affects mood and performance. Add FAQ with 3 questions.' },
  { label: 'Shopping Guide', title: 'Smart Online Fashion Shopping: Tips to Get It Right', prompt: 'Size charts, fabric descriptions, return policies. How to shop for clothes online in India. How to avoid returns. Add FAQ with 3 questions.' },
  { label: 'Fashion Forecast', title: 'Fashion Forecast: What\'s Coming Next in Indian Fashion', prompt: 'Upcoming trends, emerging designers, fabric innovations. Where Indian fashion is heading. Technology in fashion. Add FAQ with 3 questions.' },
  { label: 'Jeans Guide', title: 'The Ultimate Jeans Guide: Finding Your Perfect Pair', prompt: 'Cover skinny, straight, wide-leg, boyfriend, mom jeans. Which suits which body type. How to style jeans for different occasions. Add FAQ with 3 questions.' },
  { label: 'Blazer Styling', title: 'How to Style a Blazer: 10 Outfit Ideas', prompt: 'Cover office, casual, party, fusion looks with a blazer. Color and fit guide. How to choose the right blazer. Add FAQ with 3 questions.' },
  { label: 'Dress Guide', title: 'The Complete Dress Guide: Styles for Every Occasion', prompt: 'Cover LBD, maxi, midi, wrap, shirt dress, A-line. Which dress suits which body type and occasion. Add FAQ with 3 questions.' },
  { label: 'Jewelry Styling', title: 'How to Choose and Style Jewelry: Complete Guide', prompt: 'Cover gold vs silver, statement vs minimal, ethnic vs western jewelry. Skin tone matching. Occasion-based jewelry choices. Add FAQ with 3 questions.' },
  { label: 'Monsoon Fashion', title: 'Monsoon Fashion: Stay Stylish in the Rain', prompt: 'Quick-dry fabrics, waterproof shoes, dark colors, practical accessories. What to avoid in monsoon. Add FAQ with 3 questions.' },
  { label: 'Layering Guide', title: 'The Art of Layering: How to Layer Outfits Like a Pro', prompt: 'Cover base, mid, and outer layers. Layering for office, casual, party. Seasonal layering tips. Add FAQ with 3 questions.' },
  { label: 'Capsule Wardrobe', title: 'Build a 25-Piece Capsule Wardrobe That Works for Everything', prompt: 'Exact 25 pieces with mix-and-match formulas. 50+ outfit combinations from 25 items. Add FAQ with 3 questions.' },
  { label: 'Workwear Evolution', title: 'The Evolution of Indian Women\'s Workwear', prompt: 'From saree to suit: how Indian office fashion has changed. Current trends and future predictions. Add FAQ with 3 questions.' },
  { label: 'Kurta Styling', title: 'How to Style Kurtas: 10 Modern Ways to Wear a Classic', prompt: 'Cover kurta with jeans, palazzo, skirt, leggings, shorts, as jacket, with belt. Modern kurta styling for young women. Add FAQ with 3 questions.' },
  { label: 'Fashion Myths', title: '10 Fashion Myths Indian Women Should Stop Believing', prompt: 'Debunk myths like horizontal stripes make you look wide, black is slimming, expensive means better. Add FAQ with 3 questions.' },
];

// ─── Faceless Fashion Image Generator ──────────────────────────────────────
// Images DYNAMICALLY match the article's topic/keyword. NEVER show face.

var KEYWORD_SCENES = {
  'style': 'neck-down crop of woman styling outfit with hands adjusting blazer, bright studio',
  'trend': 'neck-down crop of woman in trendy 2025 fashion with statement accessories, modern studio',
  'wardrobe': 'neck-down crop of woman selecting clothes from curated capsule wardrobe, clean white closet',
  'occasion': 'neck-down crop of woman in elegant occasion wear with clutch and heels, luxury venue',
  'accessorize': 'neck-down crop of woman hands styling jewelry bag and shoes on marble surface, boutique',
  'accessories': 'neck-down crop of woman hands styling jewelry bag and shoes on marble surface, boutique',
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
  'capsule': 'neck-down crop of woman selecting from organized capsule wardrobe, clean closet',
};

var DEFAULT_SCENE = 'neck-down crop of stylish Indian woman in chic outfit, hands visible, clean studio';

function getSceneForKeyword(keyword) {
  if (!keyword) return DEFAULT_SCENE;
  var lower = keyword.toLowerCase();
  var keys = Object.keys(KEYWORD_SCENES);
  for (var i = 0; i < keys.length; i++) {
    if (lower.indexOf(keys[i]) !== -1) return KEYWORD_SCENES[keys[i]];
  }
  return DEFAULT_SCENE;
}

function buildHighFidelityPrompt(keyword, topicLabel, styleIndex) {
  var scene = getSceneForKeyword(keyword || topicLabel);
  return `Fashion editorial photography, ${scene}, NO FACE VISIBLE, faceless, cropped at chin, show outfit hands and body only, natural lighting, photorealistic, warm tones, clean composition, magazine quality, no text, no watermark`;
}

function generateImage(index) {
  const topic = TOPICS[index % TOPICS.length];
  const prompt = buildHighFidelityPrompt(topic.label, topic.label, index);
  const seed = `tubhyam-seed-${topic.label.replace(/\s+/g, '-')}-${index}-${Math.floor(Math.random() * 99999)}`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&seed=${seed}&nologo=true&model=flux`;
}

// ─── Keyword-based Inline Image Prompts ──────────────────────────────────────────
var INLINE_KEYWORD_SCENES = {
  'style': ['outfit flat lay with accessories and shoes on marble surface', 'styling tools including belt scarf and jewelry on clean table'],
  'trend': ['2025 fashion trend mood board with fabric swatches and photos', 'trendy outfit pieces arranged on clothing rack, boutique display'],
  'wardrobe': ['capsule wardrobe essentials neatly organized on wooden rack', 'mix-and-match clothing pieces laid out on bed, flat lay photography'],
  'occasion': ['occasion wear outfit with matching accessories on velvet surface', 'event-ready ensemble with clutch heels and jewelry, editorial flat lay'],
  'accessor': ['jewelry collection with necklaces earrings and bangles on marble', 'handbags shoes and accessories arranged in boutique display'],
  'season': ['seasonal fashion collection with layers and textures, editorial display', 'weather-appropriate outfit with fabrics and accessories, flat lay'],
  'body type': ['measuring tape with size-inclusive clothing pieces, studio photography', 'flattering outfit options for different silhouettes, clothing rack display'],
  'ethnic': ['ethnic fabric swatches with traditional embroidery, craft photography', 'fusion outfit elements blending Indian and western pieces, flat lay'],
  'color': ['colorful fabric swatches arranged in gradient, creative flat lay', 'color wheel with matching fashion accessories, design studio'],
  'formal': ['formal pants collection with blazers and shirts, boutique display', 'office wear essentials including belt watch and shoes, flat lay'],
  'fabric': ['close-up of premium fabric texture and stitching detail', 'fabric swatches with measuring tape and fashion accessories'],
  'shoe': ['shoe collection with heels sneakers and flats arranged, boutique', 'feet in stylish shoes with outfit hem visible, product photography'],
  'jewelry': ['jewelry collection with gold silver pieces on velvet, product photography', 'bangles earrings and necklace styled on marble surface'],
  'travel': ['travel capsule wardrobe packed in suitcase, flat lay photography', 'travel-ready outfit with tote bag and accessories, editorial'],
  'default': ['fashion styling flat lay with clothes shoes and accessories', 'curated outfit pieces with fabric details and accessories, product photography'],
};

function getInlineScenes(keyword) {
  if (!keyword) return INLINE_KEYWORD_SCENES['default'];
  var lower = keyword.toLowerCase();
  var keys = Object.keys(INLINE_KEYWORD_SCENES);
  for (var i = 0; i < keys.length; i++) {
    if (lower.indexOf(keys[i]) !== -1) return INLINE_KEYWORD_SCENES[keys[i]];
  }
  return INLINE_KEYWORD_SCENES['default'];
}

function injectInlineImages(htmlContent, keyword, topicLabel) {
  // Find all <h2> positions
  const h2Regex = /<\/h2>/gi;
  const matches = [...htmlContent.matchAll(h2Regex)];
  if (matches.length < 2) return htmlContent; // Not enough sections to inject

  let result = htmlContent;
  let offset = 0;
  const scenes = getInlineScenes(keyword);

  // Inject after 2nd and 4th </h2> (max 2 inline images)
  const injectAfterIndices = [1, 3]; // 0-based: after 2nd and 4th </h2>
  
  for (let j = 0; j < injectAfterIndices.length; j++) {
    const idx = injectAfterIndices[j];
    if (idx >= matches.length) continue;

    const match = matches[idx];
    const insertPos = match.index + match[0].length + offset;

    const scene = scenes[j % scenes.length];
    const prompt = `Professional fashion editorial photography, ${scene}, warm natural lighting, sharp focus, magazine quality, high resolution, no text, no watermark`;
    const seed = `tubhyam-inline-${keyword.replace(/\s+/g, '-')}-${j + 1}-${Math.floor(Math.random() * 99999)}`;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=512&seed=${seed}&nologo=true&model=flux`;

    const imgHtml = `<div style="margin:24px 0;border-radius:12px;overflow:hidden;border:1px solid rgba(212,175,55,0.2)"><img src="${imageUrl}" alt="${topicLabel} fashion styling" style="width:100%;height:auto;display:block" loading="lazy"></div>`;

    result = result.slice(0, insertPos) + imgHtml + result.slice(insertPos);
    offset += imgHtml.length;
  }

  return result;
}

function calcReadTime(html) {
  const words = html.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 200));
}

async function generateArticle(index, retries = 3) {
  const topic = TOPICS[index % TOPICS.length];
  const keywords = ["women fashion", "Indian fashion", "fashion tips", "style guide", "premium fashion"];
  const otherKw = keywords.slice(1).join(', ');

  const prompt = `You are an expert SEO content writer for Tubhyam (tubhyam.in), a premium Indian women's fashion brand. Author: ianos.

${topic.prompt}

Requirements:
- Title: "${topic.title}" (use this exact title or very close)
- Excerpt: Compelling summary, max 140 chars, call-to-action feel
- Category: ONE of: Fashion Tips, Styling, Trends, Sustainability, Craftsmanship
- Content: 800-1200 words in clean HTML. Use <h2>, <p>, <ul>/<li>, <strong>. No markdown.
- SEO: Use the main keyword 3-5 times naturally. Include: ${otherKw}
- GEO: Include concise quotable definitions AI engines can extract
- AEO: FAQ section with <h2>FAQ</h2> then <h3> questions and <p> answers
- Internal link: <a href="/products">Explore Tubhyam's collection</a>
- Tone: Professional yet friendly, Indian women 20-40
- NO pricing or product IDs

Return ONLY JSON: {"title":"...","excerpt":"...","category":"...","content":"<h2>...</h2><p>...</p>"}
CRITICAL: Raw JSON only. No markdown blocks, no extra text.`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4096,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) return null;

      let jsonStr = response.trim();
      const codeBlock = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlock) jsonStr = codeBlock[1].trim();
      else {
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) jsonStr = jsonMatch[0];
      }

      try {
        return JSON.parse(jsonStr);
      } catch {
        jsonStr = jsonStr.replace(/"([^"]*?)\n([^"]*?)"/g, '"$1\\n$2"');
        jsonStr = jsonStr.replace(/\t/g, ' ');
        jsonStr = jsonStr.replace(/,\s*}/g, '}');
        jsonStr = jsonStr.replace(/,\s*]/g, ']');
        try { return JSON.parse(jsonStr); } catch {}
        const titleMatch = jsonStr.match(/"title"\s*:\s*"([^"]+)"/);
        const excerptMatch = jsonStr.match(/"excerpt"\s*:\s*"([^"]+)"/);
        const categoryMatch = jsonStr.match(/"category"\s*:\s*"([^"]+)"/);
        const contentMatch = jsonStr.match(/"content"\s*:\s*"([\s\S]+?)"\s*\}/);
        if (titleMatch && contentMatch) {
          return {
            title: titleMatch[1],
            excerpt: excerptMatch ? excerptMatch[1] : '',
            category: categoryMatch ? categoryMatch[1] : 'Fashion Tips',
            content: contentMatch[1].replace(/\\n/g, '\n'),
          };
        }
        return null;
      }
    } catch (err) {
      if (err.status === 429 && attempt < retries - 1) {
        const waitTime = err.message?.match(/try again in ([\d.]+m)?([\d.]+s)?/);
        let seconds = 30;
        if (waitTime) {
          const mins = waitTime[1] ? parseFloat(waitTime[1]) : 0;
          const secs = waitTime[2] ? parseFloat(waitTime[2]) : 0;
          seconds = Math.ceil(mins * 60 + secs) + 5;
        }
        console.log(`  ⏳ Rate limited, waiting ${seconds}s before retry (${attempt + 1}/${retries})...`);
        await new Promise(r => setTimeout(r, seconds * 1000));
      } else {
        throw err;
      }
    }
  }
  return null;
}

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!');

  const TOTAL = 30;
  const PUBLISH_NOW = 9; // First 9 published immediately

  console.log(`\nGenerating ${TOTAL} articles (Jun 29 - Jul 29, 2026)`);
  console.log(`First ${PUBLISH_NOW} will be published NOW, rest scheduled 1/day\n`);

  // Clear existing blog data to avoid duplicates
  const existing = await Blog.countDocuments();
  if (existing > 0) {
    console.log(`Clearing ${existing} existing articles...`);
    await Blog.deleteMany({});
  }

  let publishedCount = 0;
  let scheduledCount = 0;

  for (let i = 0; i < TOTAL; i++) {
    try {
      const topic = TOPICS[i];
      console.log(`[${i + 1}/${TOTAL}] ${topic.label}: "${topic.title}"...`);

      const article = await generateArticle(i);
      if (!article) {
        console.log(`  ✗ Failed to generate`);
        continue;
      }

      const image = generateImage(i);
      const publishDate = new Date(2026, 5, 29 + i); // Jun 29 + i days
      const isPublished = i < PUBLISH_NOW;

      // Inject inline images into article body
      const contentWithImages = injectInlineImages(article.content, topic.label, topic.label);

      const blog = new Blog({
        title: article.title || topic.title,
        excerpt: article.excerpt,
        content: contentWithImages,
        category: article.category || 'Fashion Tips',
        keywords: ["women fashion", "Indian fashion", "fashion tips", "style guide", "premium fashion"],
        image,
        author: 'ianos',
        readTime: calcReadTime(article.content),
        status: isPublished ? 'published' : 'scheduled',
        publishedAt: isPublished ? new Date() : null,
        scheduledPublishDate: isPublished ? null : publishDate,
      });

      await blog.save();

      if (isPublished) {
        console.log(`  ✓ PUBLISHED NOW`);
        publishedCount++;
      } else {
        console.log(`  ✓ Scheduled: ${publishDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`);
        scheduledCount++;
      }
      console.log(`    Image: seed=${i * 1000}`);
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }
  }

  console.log(`\n✓ Done! ${publishedCount} published, ${scheduledCount} scheduled.`);
  console.log('Blog page should now show 9 cards with unique images.\n');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
