/**
 * Inject inline images into existing blog articles
 * Run: node tubhyamoffical/server/inject-blog-images.cjs
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const INLINE_IMAGE_PROMPTS = [
  'elegant Indian woman wearing tailored formal pants in bright modern boutique, trying on clothes, fashion editorial photography, natural lighting',
  'professional Indian woman styling formal trousers with blazer in office setting, confident pose, corporate fashion photography',
  'close-up of premium women\'s formal pants fabric texture, high quality stitching detail, luxury textile photography',
  'Indian woman trying different formal pants outfits in front of mirror, fashion styling session, lifestyle photography',
  'flat lay of women\'s formal pants wardrobe essentials, folded trousers with accessories, clean minimal styling',
  'group of diverse Indian women wearing different styles of formal pants, body positivity, inclusive fashion photography',
  'Indian woman caring for formal pants, ironing and folding clothes, neat organized wardrobe, lifestyle photography',
  'stylish Indian woman walking in wide-leg formal pants on city street, street style fashion photography, golden hour',
  'Indian woman in festive formal pants outfit at celebration, elegant indo-western fusion fashion, warm lighting',
  'professional Indian woman accessorizing formal pants with belt shoes jewelry, styling flat lay photography',
  'Indian woman wearing high-waisted formal pants with tucked blouse, modern office fashion, clean aesthetic photography',
  'beautiful Indian model in slim-fit formal trousers, walking through luxury hotel lobby, editorial fashion photography',
  'Indian woman comparing different formal pants fits and cuts, fashion guide photography, bright studio lighting',
  'elegant Indian woman in monochrome formal pants outfit, minimalist fashion photography, white background',
  'Indian woman wearing formal pants for outdoor brunch, casual elegance, natural daylight lifestyle photography',
  'close-up of women\'s formal pants waistband and belt detail, premium quality fashion accessory photography',
];

function injectInlineImages(htmlContent, articleIndex, topicLabel) {
  // Already has inline images? Skip
  if (htmlContent.includes('<img')) return htmlContent;

  const h2Regex = /<\/h2>/gi;
  const matches = [...htmlContent.matchAll(h2Regex)];
  if (matches.length < 2) return htmlContent;

  let result = htmlContent;
  let offset = 0;

  // Inject after 2nd and 4th </h2> (max 2 inline images per article)
  const injectAfterIndices = [1, 3];

  for (let j = 0; j < injectAfterIndices.length; j++) {
    const idx = injectAfterIndices[j];
    if (idx >= matches.length) continue;

    const match = matches[idx];
    const insertPos = match.index + match[0].length + offset;

    const promptIndex = (articleIndex * 3 + j * 7) % INLINE_IMAGE_PROMPTS.length;
    const prompt = INLINE_IMAGE_PROMPTS[promptIndex];
    const seed = articleIndex * 100 + (j + 1) * 37 + Math.floor(Math.random() * 999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=700&height=450&seed=${seed}&nologo=true`;

    const altText = topicLabel || 'fashion styling';
    const imgHtml = `<div style="margin:24px 0;border-radius:12px;overflow:hidden;border:1px solid rgba(212,175,55,0.2)"><img src="${imageUrl}" alt="${altText}" style="width:100%;height:auto;display:block" loading="lazy"></div>`;

    result = result.slice(0, insertPos) + imgHtml + result.slice(insertPos);
    offset += imgHtml.length;
  }

  return result;
}

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!');

  const blogs = await Blog.find().sort({ createdAt: 1 });
  console.log(`Found ${blogs.length} articles to update\n`);

  let updated = 0;
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    const newContent = injectInlineImages(blog.content, i, blog.title);
    
    if (newContent !== blog.content) {
      blog.content = newContent;
      await blog.save();
      updated++;
      console.log(`[${i + 1}/${blogs.length}] ✓ Injected images: "${blog.title.substring(0, 50)}..."`);
    } else {
      console.log(`[${i + 1}/${blogs.length}] - Skipped (no H2 sections or already has images): "${blog.title.substring(0, 50)}..."`);
    }
  }

  console.log(`\n✓ Done! Updated ${updated} of ${blogs.length} articles with inline images.`);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
