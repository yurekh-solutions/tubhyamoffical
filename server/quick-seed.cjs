/**
 * Quick Blog Seeder - No API needed
 * Seeds 9 published articles instantly so the blog page shows content.
 * Run: node tubhyamoffical/server/quick-seed.cjs
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

// ─── Faceless Fashion Image Generator ──────────────────────────────────────
// Images DYNAMICALLY match the article's keyword/topic. NEVER show face.

var KEYWORD_SCENES = {
  'western wear': 'neck-down crop of woman in trendy western outfit with crop top and wide-leg pants, modern studio',
  'western': 'neck-down crop of woman in stylish western wear outfit with bag and heels, urban setting',
  'top': 'neck-down crop of woman in fashionable top with jeans, hands adjusting sleeve, bright studio',
  'bottom': 'neck-down crop of woman in stylish bottoms with tucked-in top, full outfit visible, studio',
  'formal pants': 'neck-down crop of woman in tailored formal pants with blazer and heels, modern office',
  'trousers': 'neck-down crop of woman in structured trousers with elegant top, professional studio',
  'palazzo': 'neck-down crop of woman in flowing palazzo pants with fitted top, breezy outdoor terrace',
  'wide leg': 'neck-down crop of woman in wide-leg pants with tucked-in blouse, modern studio',
  'cargo': 'neck-down crop of woman in cargo pants with crop top and sneakers, urban street',
  'track pants': 'neck-down crop of woman in stylish track pants with fitted top and sneakers, outdoor setting',
  'tracks': 'neck-down crop of woman in coordinated track suit with sneakers, sporty outdoor setting',
  'jogger': 'neck-down crop of woman in slim joggers with oversized sweatshirt and sneakers, park setting',
  'jeans': 'neck-down crop of woman in perfect-fit jeans with stylish top and belt, urban street',
  'denim': 'neck-down crop of woman in denim outfit with jeans and jacket, hands in pockets, street style',
  'casual': 'neck-down crop of woman in relaxed casual outfit with jeans and sneakers, outdoor cafe',
  'casual pants': 'neck-down crop of woman in comfortable casual pants with soft top, relaxed setting',
  'ootd': 'neck-down crop of woman in perfectly styled outfit of the day, hands on bag, Instagram-worthy setting',
  'gen z': 'neck-down crop of woman in gen-z trendy outfit with baggy jeans and crop top, neon studio',
  'genz': 'neck-down crop of woman in youthful trendy outfit with layered accessories, modern street',
  'streetwear': 'neck-down crop of woman in oversized streetwear with baggy pants and chunky sneakers, graffiti wall',
  'collection': 'neck-down crop of woman modeling latest fashion collection piece, editorial studio',
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
  'formal': 'neck-down crop of woman in tailored formal outfit with structured bag, professional setting',
  'fabric': 'neck-down crop of woman touching premium fabric texture, design studio with swatches',
  'budget': 'neck-down crop of woman holding shopping bags with stylish outfit, city street',
  'shoe': 'neck-down crop of woman feet in stylish heels with outfit visible, boutique floor',
  'jewelry': 'neck-down crop of woman hands wearing bangles and rings with outfit, soft lighting',
  'festival': 'neck-down crop of woman in festive outfit with bangles and clutch, decorated venue',
  'blazer': 'neck-down crop of woman in structured blazer outfit with hands in pockets, office lobby',
  'dress': 'neck-down crop of woman in elegant dress with heels and clutch, evening setting',
  'party': 'neck-down crop of woman in glamorous party outfit with metallic heels and clutch, nightlife venue',
  'beige': 'neck-down crop of woman in elegant beige-toned outfit with matching accessories, neutral studio',
  'cotton': 'neck-down crop of woman in soft cotton outfit with natural drape, relaxed setting',
  'kurta': 'neck-down crop of woman in modern kurta with jeans and juttis, bright patio',
  'saree': 'neck-down crop of woman in modern saree drape with heels, elegant venue',
  'travel': 'neck-down crop of woman in travel-ready outfit with tote and sunglasses, airport lounge',
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

function buildImagePrompt(keyword, topicLabel, styleIndex) {
  var scene = getSceneForKeyword(keyword);
  return 'Fashion editorial photography, ' + scene + ', NO FACE VISIBLE, faceless, cropped at chin, show outfit hands and body only, natural lighting, photorealistic, warm tones, clean composition, magazine quality, no text, no watermark';
}

function buildImageUrl(prompt, keyword) {
  var seed = 'tubhyam-v4-' + keyword.replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 99999);
  return 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1280&height=720&seed=' + seed + '&nologo=true&model=flux';
}

// ─── 9 Pre-written SEO-optimized articles ──────────────────────────────────────
const ARTICLES = [
  {
    title: 'How to Style Any Outfit Like a Pro: Complete Guide for Indian Women',
    slug: 'how-to-style-any-outfit-like-pro',
    excerpt: 'Master the art of styling — from casual to ethnic, office to party, here are the rules that transform any outfit.',
    category: 'Styling Guide',
    keywords: ['how to style outfits', 'fashion styling tips', 'outfit ideas Indian women', 'dressing better'],
    readTime: 8,
    content: '<h2>The 5 Golden Rules of Styling</h2><p>Before diving into specific outfits, master these universal styling principles that work for every Indian woman regardless of body type or budget. These rules are used by professional stylists across the fashion industry.</p><h3>Rule 1: The Rule of Thirds</h3><p>Never divide your outfit 50-50. A tucked-in top with high-waisted pants creates a 1:2 ratio that elongates your legs and creates a more flattering silhouette. This works with jeans, formal pants, skirts, and even ethnic wear.</p><h3>Rule 2: One Statement Piece</h3><p>Let one item be the hero of your outfit. If you\'re wearing bold earrings, keep the necklace minimal. If your top is eye-catching, pair it with simple bottoms. This prevents visual clutter and makes your outfit look intentional.</p><h3>Rule 3: The Shoe Game Changer</h3><p>Your shoes set the tone for your entire outfit. Swap sneakers for heels and you instantly go from casual to polished. Switch from formal shoes to juttis and you blend western and ethnic seamlessly.</p><h3>Rule 4: Layering Is Your Secret Weapon</h3><p>A structured blazer, a lightweight scarf, or an open shirt over a tank top — layers add dimension and sophistication to even the simplest outfit.</p><h3>Rule 5: Fit Over Fashion</h3><p>A well-fitted outfit always looks more expensive and polished than a trendy but ill-fitting one. Invest in tailoring for your favorite pieces.</p><h2>Styling by Occasion</h2><h3>Office Wear</h3><p>Stick to a capsule of neutral-colored bottoms (black, navy, beige) paired with 5-6 quality tops. Add one blazer and you can create 10+ combinations. Keep jewelry minimal — studs and a delicate chain are perfect.</p><h3>Casual Outings</h3><p>Jeans with a tucked-in tee and white sneakers is the ultimate easy outfit. Add a crossbody bag and sunglasses for a put-together look that requires zero effort.</p><h3>Ethnic Occasions</h3><p>For festivals and family events, a simple kurta with statement earrings and juttis looks elegant. Add a dupatta draped casually for traditional grace.</p><h3>Party and Evening</h3><p>Go for one standout piece — a bold lip color, metallic heels, or a sequined clutch. Keep everything else refined. A little black dress or a fusion outfit (crop top with palazzo pants) works beautifully.</p><h3>Travel Days</h3><p>Comfort is key but style doesn\'t have to suffer. Stretch pants, a breathable tunic, slip-on shoes, and a roomy tote. Add a lightweight scarf for layering on chilly flights.</p><h2>Color Matching Made Easy</h2><ul><li><strong>Monochrome:</strong> All one color family (e.g., all beige) looks expensive and modern</li><li><strong>Complementary:</strong> Opposite colors on the wheel (blue + orange, purple + yellow) create bold looks</li><li><strong>Analogous:</strong> Colors next to each other (blue + green, red + orange) are harmonious</li><li><strong>Neutrals + One Pop:</strong> Neutral base (black, white, beige) with one bold color always works</li></ul><h2>Building a Versatile Wardrobe on a Budget</h2><p>Start with 10 core pieces: 2 pairs of bottoms (jeans + formal pants), 4 tops (2 casual, 2 dressy), 1 blazer, 1 ethnic kurta, 1 dress, 1 pair each of sneakers and heels. This gives you 30+ outfit combinations. Shop Tubhyam\'s collection for quality basics that mix and match effortlessly.</p><h2>FAQ</h2><h3>How do I look put-together without spending a lot?</h3><p>Focus on fit, stick to a cohesive color palette, and invest in one good blazer and one good pair of shoes. These two items instantly elevate any outfit.</p><h3>What\'s the easiest way to dress up a casual outfit?</h3><p>Swap sneakers for heels or formal shoes, add a structured bag, and put on a pair of earrings. These three changes transform any casual look into polished casual.</p><h3>Can I mix ethnic and western pieces?</h3><p>Absolutely! Indo-western fusion is a major trend. Try jeans with a short kurta, formal pants with an ethnic-print top, or a saree belt with a western dress.</p><h3>How many clothes do I really need?</h3><p>A capsule wardrobe of 25-30 pieces can give you 100+ outfit combinations. Quality over quantity always wins.</p>',
  },
  {
    title: 'Fashion Trends 2025: What Every Indian Woman Needs to Know',
    slug: 'fashion-trends-2025-indian-women',
    excerpt: 'From quiet luxury to bold ethnic revival — the fashion trends defining 2025 for Indian women.',
    category: 'Trend Report',
    keywords: ['fashion trends 2025', '2025 fashion trends India', 'latest fashion trends women', 'what to wear 2025'],
    readTime: 7,
    content: '<h2>The Big Picture: What\'s Shaping Fashion in 2025</h2><p>2025 is the year fashion gets practical yet expressive. Post-pandemic comfort-first dressing has matured into something more polished — think structured silhouettes, rich textures, and a celebration of personal style over trends. For Indian women specifically, it\'s about blending global aesthetics with cultural confidence.</p><h2>Trend 1: Quiet Luxury</h2><p>The "old money" aesthetic has evolved into quiet luxury — minimal logos, premium fabrics, and timeless silhouettes. Think cashmere-like knits, silk blouses, well-tailored trousers, and structured bags. No flash, just understated elegance that looks expensive.</p><h3>How to Wear It</h3><ul><li>Invest in neutral-toned basics with premium fabric feel</li><li>Keep accessories minimal but quality — a good watch, leather bag, simple gold jewelry</li><li>Stick to a muted color palette: cream, camel, navy, charcoal, black</li></ul><h2>Trend 2: Bold Color Revival</h2><p>After years of neutrals dominating fashion, 2025 sees the return of bold, saturated colors. Cobalt blue, emerald green, hot pink, and sunny yellow are everywhere. The key is to wear one bold color at a time and anchor it with neutrals.</p><h2>Trend 3: The Ethnic Renaissance</h2><p>Indian ethnic wear is having a global moment. Handloom fabrics, traditional prints (ikat, block print, bandhani), and artisanal embroidery are being embraced by fashion-forward women everywhere. The modern twist? Pairing them with western pieces for fusion looks.</p><h3>Try This</h3><p>Pair a handloom cotton kurta with jeans, or wear a block-print dupatta over a western dress. It\'s culturally rooted but globally stylish.</p><h2>Trend 4: Wide-Leg Everything</h2><p>From formal pants to palazzos to wide-leg jeans — the relaxed silhouette dominates. Skinny fits aren\'t dead, but the trend is firmly toward comfort and flow. High-waisted wide-leg pants with a tucked-in top is the uniform of 2025.</p><h2>Trend 5: Sustainable Fashion</h2><p>Eco-conscious dressing has gone mainstream. Look for brands using organic cotton, recycled fabrics, and ethical manufacturing. Thrifting and upcycling are also huge trends among fashion-savvy women.</p><h2>Trend 6: Platform Shoes and Chunky Soles</h2><p>From sneakers to sandals, thick soles and platforms are everywhere. They add height, look modern, and are surprisingly comfortable. Perfect for Indian women who want the elevation of heels with the comfort of flats.</p><h2>Trends to Avoid in 2025</h2><ul><li><strong>Overly distressed denim:</strong> Clean, minimal jeans look more polished</li><li><strong>Fast fashion logos:</strong> The trend is away from brand-heavy clothing</li><li><strong>Low-rise pants:</strong> Mid and high-rise continue to dominate</li></ul><h2>FAQ</h2><h3>Are these trends affordable to follow?</h3><p>Yes! You don\'t need to buy new everything. Focus on 2-3 trend pieces and mix with your existing wardrobe. Tubhyam offers trend-forward pieces at accessible prices.</p><h3>What\'s the one trend every Indian woman should try?</h3><p>Quiet luxury — it\'s universally flattering, works for all ages and body types, and makes you look polished without trying too hard.</p><h3>How do I stay trendy without losing my personal style?</h3><p>Adopt trends that align with your existing style preferences. If you\'re minimal, try quiet luxury. If you love color, embrace the bold color trend. Fashion should enhance your identity, not replace it.</p>',
  },
  {
    title: '15 Wardrobe Essentials Every Indian Woman Must Have in 2025',
    slug: 'wardrobe-essentials-indian-women-2025',
    excerpt: 'Build a complete, versatile wardrobe with these 15 must-have pieces that work for every occasion.',
    category: 'Wardrobe Guide',
    keywords: ['wardrobe essentials', 'must have wardrobe items', 'basic wardrobe for women', 'capsule wardrobe India'],
    readTime: 8,
    content: '<h2>Why a Capsule Wardrobe Changes Everything</h2><p>A capsule wardrobe means fewer decisions in the morning, less clutter in your closet, and always having something perfect to wear. These 15 pieces work together to create 100+ outfit combinations for any occasion in an Indian woman\'s life.</p><h2>The 15 Essential Pieces</h2><h3>1. White Button-Down Shirt</h3><p>The most versatile piece in any wardrobe. Wear it to the office with formal pants, over jeans for brunch, tucked into a skirt for a date, or even open over a tank top for a relaxed look.</p><h3>2. Well-Fitted Jeans</h3><p>Invest in one pair of dark wash and one pair of light wash jeans. Mid-rise, straight or slightly tapered legs are the most flattering for Indian body types.</p><h3>3. Black Formal Pants</h3><p>These are non-negotiable. A pair of quality black formal pants takes you from interviews to boardroom meetings to evening events. Choose a fabric with slight stretch for all-day comfort.</p><h3>4. Little Black Dress (LBD)</h3><p>One dress that works for dinners, parties, and formal events. Choose a style that flatters your body type and hits at or just above the knee.</p><h3>5. Structured Blazer</h3><p>Instantly elevates any outfit. Throw it over a t-shirt and jeans or layer over a dress for evening events. Navy or black works best.</p><h3>6. Basic Kurta (Neutral Color)</h3><p>A well-fitted kurta in beige, cream, or a soft pastel. Works for festivals, family gatherings, or even office Fridays with an Indian touch.</p><h3>7. White Sneakers</h3><p>Clean, minimal white sneakers work with jeans, dresses, and even some ethnic wear for a modern fusion look. Keep them spotless.</p><h3>8. Nude Heels</h3><p>Nude heels elongate the legs and work with literally every outfit. Invest in a comfortable pair with a manageable heel height (2-3 inches).</p><h3>9. Everyday Crossbody Bag</h3><p>A medium-sized bag that fits your phone, wallet, keys, and makeup essentials. Choose a neutral color (tan, black, or burgundy) in vegan leather.</p><h3>10. Structured Tote</h3><p>For office days — fits your laptop, water bottle, and daily essentials. Structured shape looks professional and organized.</p><h3>11. Statement Earrings</h3><p>One pair of bold earrings (jhumkas, chandbalis, or geometric drops) that instantly dress up any outfit from basic to party-ready.</p><h3>12. Classic Watch</h3><p>A simple, elegant watch in gold or silver tone. It\'s the one accessory that works with every outfit and every occasion.</p><h3>13. Dupatta in a Bold Color</h3><p>A dupatta in jewel tone (emerald, ruby, or royal blue) that can transform a simple kurta or add ethnic flair to western outfits.</p><h3>14. Cardigan or Light Jacket</h3><p>For air-conditioned offices, travel days, and transitional weather. Choose a neutral color in a soft knit fabric.</p><h3>15. Comfortable Flats (Juttis or Loafers)</h3><p>For days when heels aren\'t an option. Embroidered juttis work with ethnic wear; leather loafers work with western outfits.</p><h2>Budget Tips for Building Your Capsule</h2><ul><li>Buy one piece at a time — quality over quantity</li><li>Shop end-of-season sales for next year\'s staples</li><li>Invest more in pieces you\'ll wear daily (jeans, formal pants, blazer)</li><li>Keep accessories budget-friendly — trends change faster here</li></ul><h2>FAQ</h2><h3>How much should I spend on a capsule wardrobe?</h3><p>You don\'t need to buy everything at once. Start with 5 core pieces and build over 6-12 months. Budget \u20b915,000-\u20b925,000 for a complete 15-piece capsule from brands like Tubhyam.</p><h3>Can I include printed pieces in a capsule wardrobe?</h3><p>Yes! Include 1-2 printed pieces (a blouse or kurta) that coordinate with your solid basics. Prints add personality without reducing versatility.</p><h3>How do I know what size to buy?</h3><p>Always check the size chart, measure yourself, and when between sizes, size up for comfort. Tubhyam offers inclusive sizing from XS to 5XL.</p>',
  },
  {
    title: 'What to Wear Where: Complete Occasion Dressing Guide',
    slug: 'what-to-wear-where-occasion-guide',
    excerpt: 'Never wonder "what should I wear" again — your complete guide to dressing perfectly for 10+ occasions.',
    category: 'Occasion Wear',
    keywords: ['what to wear occasion', 'occasion dressing guide', 'what to wear to wedding', 'outfit ideas by occasion'],
    readTime: 8,
    content: '<h2>The Occasion Dressing Formula</h2><p>Dressing right for every occasion doesn\'t require a huge wardrobe — it requires knowing which pieces work for which settings. Here\'s your complete guide for the 10 most common occasions in an Indian woman\'s life.</p><h2>1. Office / Daily Work</h2><p><strong>Go-to:</strong> Formal pants + button-down shirt or blouse + structured blazer + pointed-toe heels</p><p><strong>Colors:</strong> Navy, black, grey, white, beige — professional palette</p><p><strong>Accessories:</strong> Stud earrings, watch, structured tote</p><h2>2. Job Interview</h2><p><strong>Go-to:</strong> Tailored formal pants + white or light blue shirt + blazer + closed-toe pumps</p><p><strong>Colors:</strong> Conservative — navy, black, or charcoal with a light top</p><p><strong>Avoid:</strong> Bold prints, excessive jewelry, overly casual shoes</p><h2>3. Wedding Guest</h2><p><strong>Go-to:</strong> Anarkali suit, saree, or fusion outfit (crop top + palazzo pants) + statement jewelry + heels</p><p><strong>Colors:</strong> Rich jewel tones — emerald, ruby, royal blue, gold</p><p><strong>Avoid:</strong> White or red (reserved for bride in some traditions)</p><h2>4. Party / Night Out</h2><p><strong>Go-to:</strong> Little black dress OR high-waisted pants + satin top + strappy heels + bold earrings</p><p><strong>Colors:</strong> Black, metallics, or one bold color</p><p><strong>Accessories:</strong> Clutch, statement earrings, bold lip color</p><h2>5. Date Night</h2><p><strong>Go-to:</strong> Fitted dress or jeans + feminine blouse + block heels + delicate jewelry</p><p><strong>Colors:</strong> Soft tones — blush, mauve, burgundy, or classic black</p><p><strong>Vibe:</strong> Romantic but comfortable — you want to enjoy the evening</p><h2>6. Festival (Diwali, Eid, etc.)</h2><p><strong>Go-to:</strong> Kurta set with dupatta OR Indo-western fusion + jhumkas + juttis or heels</p><p><strong>Colors:</strong> Bright and festive — gold, red, orange, green</p><p><strong>Accessories:</strong> Statement earrings, bangles, bindi for traditional touch</p><h2>7. Casual Outing / Brunch</h2><p><strong>Go-to:</strong> Jeans + tucked-in top or casual kurta + white sneakers or flats + crossbody bag</p><p><strong>Colors:</strong> Anything goes — pastels, prints, bold colors</p><p><strong>Vibe:</strong> Relaxed, effortless, Instagram-friendly</p><h2>8. Travel Days</h2><p><strong>Go-to:</strong> Stretch pants + breathable tunic + slip-on shoes + roomy tote + lightweight scarf</p><p><strong>Colors:</strong> Dark base (hides spills) + colorful scarf or jacket</p><p><strong>Priority:</strong> Comfort without sacrificing style</p><h2>9. Formal Event / Conference</h2><p><strong>Go-to:</strong> Power suit (blazer + matching pants) OR elegant dress + structured bag + low heels</p><p><strong>Colors:</strong> Black, navy, charcoal, or one strong color like emerald</p><p><strong>Vibe:</strong> Authoritative and approachable</p><h2>10. Family Gathering</h2><p><strong>Go-to:</strong> Simple kurta + leggings or palazzo + minimal jewelry + flats or small heels</p><p><strong>Colors:</strong> Soft, warm tones — peach, coral, cream, sage</p><p><strong>Vibe:</strong> Respectful, comfortable, put-together</p><h2>FAQ</h2><h3>What if I don\'t have the "right" outfit for an occasion?</h3><p>Start with your most versatile piece (usually black formal pants or a simple dress) and accessorize to match the occasion. A blazer makes anything more formal; sneakers make anything more casual.</p><h3>How do I transition from day to night?</h3><p>Keep the base outfit the same, swap flats for heels, add bold jewelry, touch up your makeup, and switch to a clutch. That\'s your day-to-night transformation.</p><h3>What\'s the most versatile occasion outfit?</h3><p>A well-fitted pair of black formal pants + a few different tops and accessories can handle 8 out of 10 occasions on this list.</p>',
  },
  {
    title: 'How to Accessorize Any Outfit: Jewelry, Bags, and Shoes Guide',
    slug: 'how-to-accessorize-outfit-jewelry-bags-shoes',
    excerpt: 'The right accessories transform any outfit from basic to stunning — here\'s exactly how to style them.',
    category: 'Accessories',
    keywords: ['how to accessorize outfits', 'fashion accessories guide', 'jewelry styling', 'shoes and bags pairing'],
    readTime: 7,
    content: '<h2>The Accessories Formula</h2><p>Accessories are the difference between "getting dressed" and "putting together a look." Master these rules and you\'ll never feel underdressed or overdressed again.</p><h2>Jewelry: Less Is More (Usually)</h2><h3>For Office Wear</h3><p>Stick to 2-3 pieces maximum: stud earrings + a delicate chain necklace + a watch. Keep metals consistent (all gold-tone or all silver-tone) for a polished look.</p><h3>For Evening and Parties</h3><p>Choose ONE statement piece and keep everything else minimal. Bold earrings? Skip the necklace. Statement necklace? Go with small studs only. This prevents the "too much" look.</p><h3>For Ethnic Occasions</h3><p>Jhumkas, chandbalis, or temple jewelry work beautifully. Add a maang tikka or bangles for traditional events. For Indo-western looks, pair ethnic earrings with a simple western outfit.</p><h3>Skin Tone Matching</h3><ul><li><strong>Warm skin tone:</strong> Gold, rose gold, copper, and warm-toned gemstones (citrine, garnet)</li><li><strong>Cool skin tone:</strong> Silver, platinum, white gold, and cool-toned gems (sapphire, amethyst)</li><li><strong>Neutral skin tone:</strong> Both gold and silver look great — mix freely</li></ul><h2>Bags: The Right One for Every Occasion</h2><h3>Everyday Crossbody</h3><p>Medium size, neutral color (tan, black, or burgundy). Fits phone, wallet, keys, lipstick. The workhorse of your bag collection.</p><h3>Office Tote</h3><p>Structured, fits laptop, has internal pockets. Black, navy, or tan leather (or vegan leather). This is an investment piece — choose quality over trends.</p><h3>Evening Clutch</h3><p>Small, elegant, metallic or bold color. Fits phone, cards, and a lipstick. This is where you can have fun with embellishments and textures.</p><h3>Casual Backpack or Bucket Bag</h3><p>For weekends, shopping, and casual outings. Choose something lightweight in canvas or soft leather.</p><h2>Shoes: Setting the Tone</h2><h3>The 5 Essential Pairs</h3><ul><li><strong>White Sneakers:</strong> Casual, modern, goes with everything from jeans to dresses</li><li><strong>Nude Heels (2-3 inches):</strong> Universal — works with every outfit and occasion</li><li><strong>Black Pointed-Toe Pumps:</strong> Office, interviews, formal events</li><li><strong>Flat Juttis or Loafers:</strong> Ethnic and western casual, all-day comfort</li><li><strong>Strappy Sandals (block heel):</strong> Date nights, parties, weddings</li></ul><h3>Day vs Night Shoe Rules</h3><p>Day: Flats, sneakers, low block heels in matte finishes. Night: Higher heels, metallics, patent leather, or embellished styles.</p><h2>The Complete Accessory Checklist</h2><p>Before leaving home, check: Earrings? Watch or bracelet? Bag? Shoes match the formality? One quick mirror check — if something feels "too much," remove one accessory.</p><h2>FAQ</h2><h3>How do I match bag and shoe colors?</h3><p>They don\'t need to match exactly — they just need to coordinate. A tan bag with brown shoes, or a black bag with navy shoes both work. The old "must match" rule is outdated.</p><h3>Can I wear gold and silver jewelry together?</h3><p>Yes! Mixed metals is a major trend. Just make sure the pieces are balanced — not too many competing elements.</p><h3>What\'s the minimum accessories I should wear?</h3><p>At minimum: earrings and a watch. Even the simplest outfit looks intentional with these two pieces.</p>',
  },
  {
    title: 'Indian Fashion for Every Season: Summer to Winter Style Guide',
    slug: 'indian-fashion-every-season-guide',
    excerpt: 'Stay stylish through every Indian season — from scorching summers to cozy winters, here\'s what to wear.',
    category: 'Seasonal Fashion',
    keywords: ['seasonal fashion India', 'summer fashion India', 'winter outfit ideas', 'monsoon dressing'],
    readTime: 7,
    content: '<h2>India\'s Unique Fashion Calendar</h2><p>India\'s climate is diverse — from tropical heat to chilly winters — and your wardrobe needs to adapt accordingly. Here\'s a season-by-season guide to looking stylish while staying comfortable.</p><h2>Summer (March - June)</h2><h3>Fabrics to Choose</h3><ul><li>Cotton and cotton blends — breathable, moisture-absorbing</li><li>Linen — naturally cool, looks effortlessly chic</li><li>Chiffon and georgette — light, flowy, perfect for ethnic wear</li><li>Rayon and viscose — soft, drapey, affordable</li></ul><h3>Colors</h3><p>Light and bright — white, pastels (mint, lavender, peach), light blue, and sunny yellow. These reflect heat and look fresh.</p><h3>Summer Outfit Formulas</h3><ul><li>Cotton kurta + white leggings + juttis (everyday ethnic)</li><li>Linen shirt + wide-leg pants + white sneakers (western casual)</li><li>Cotton dress + sandals + crossbody (brunch-ready)</li><li>Loose palazzo + fitted tank + sandals (loungewear that looks good)</li></ul><h2>Monsoon (July - September)</h2><h3>Fabrics to Choose</h3><p>Quick-drying synthetics, cotton blends, and water-resistant materials. Avoid pure silk (water spots), heavy denim (takes forever to dry), and light colors (mud stains).</p><h3>Colors</h3><p>Dark and practical — navy, charcoal, black, deep green, maroon. Prints are great because they hide water spots!</p><h3>Monsoon Essentials</h3><ul><li>Waterproof or water-resistant shoes (skip suede!)</li><li>An umbrella always in the bag</li><li>A lightweight raincoat or poncho for two-wheeler commuters</li><li>Dark-colored bags that handle rain</li></ul><h2>Autumn (October - November)</h2><p>The most pleasant season for fashion! This is when layering shines and festive season kicks in.</p><h3>Festive Season Tips</h3><ul><li>Invest in 2-3 festive outfits (Diwali, Durga Puja, Eid) in rich colors</li><li>Layer with light jackets or stoles as evenings cool down</li><li>This is the best time for outdoor fashion photography!</li></ul><h2>Winter (December - February)</h2><h3>Layering Strategy</h3><p>The secret to winter style is smart layering — looking warm without looking bulky.</p><ul><li><strong>Base layer:</strong> Thermal or fitted turtleneck</li><li><strong>Mid layer:</strong> Cardigan, sweater, or kurta</li><li><strong>Outer layer:</strong> Blazer, coat, or shawl</li></ul><h3>Winter Colors</h3><p>Rich and deep — burgundy, forest green, mustard, navy, charcoal, chocolate brown. These colors feel cozy and sophisticated.</p><h3>Winter Must-Haves</h3><ul><li>A quality wool or wool-blend blazer</li><li>2-3 warm but stylish scarves</li><li>Boots (ankle or knee-high) — warm and fashionable</li><li>Thermal leggings to wear under pants and dresses</li></ul><h2>FAQ</h2><h3>How do I transition outfits between seasons?</h3><p>Layering is key. A summer dress + cardigan + boots becomes an autumn outfit. Formal pants + tank + blazer works for both summer AC offices and autumn outdoors.</p><h3>What fabrics should I avoid in Indian summers?</h3><p>Polyester (traps heat), heavy silk, and thick denim. These fabrics don\'t breathe well in India\'s humidity.</p><h3>How do I look stylish in monsoon without ruining my clothes?</h3><p>Stick to dark colors, synthetic blends, waterproof shoes, and always carry a compact umbrella. Tubhyam\'s monsoon-friendly collection handles rain beautifully.</p>',
  },
  {
    title: 'Dressing for Your Body Type: Flattering Fashion for Every Indian Woman',
    slug: 'dressing-body-type-flattering-fashion',
    excerpt: 'Your body is perfect — here\'s how to dress it. A body-positive guide for 6 body types.',
    category: 'Body Type Guide',
    keywords: ['dressing for body type', 'flattering outfits body type', 'fashion for curvy women', 'petite fashion tips'],
    readTime: 7,
    content: '<h2>Your Body, Your Rules</h2><p>Every body is beautiful. Fashion isn\'t about "hiding" parts of yourself — it\'s about highlighting what you love and feeling confident in your clothes. This guide helps you find silhouettes and styles that make you feel amazing.</p><h2>Identifying Your Body Type</h2><p>Stand in front of a mirror and note your proportions. The key measurements are shoulders, bust, waist, and hips. Your body type is determined by where you carry the most and least volume.</p><h2>Petite (Under 5\'4")</h2><h3>Best Silhouettes</h3><ul><li>High-waisted everything (pants, skirts) — creates longer leg line</li><li>Fitted, cropped tops or tucked-in blouses</li><li>Ankle-length pants (not full-length that bunches)</li><li>Vertical stripes and monochrome outfits</li></ul><h3>What to Avoid</h3><p>Oversized tops that swallow your frame, very wide-leg pants (unless paired with heels), and large prints that overwhelm.</p><h2>Tall (5\'7" and Above)</h2><h3>Best Silhouettes</h3><ul><li>Wide-leg pants — you carry them beautifully</li><li>Maxi dresses and long kurtas</li><li>High-low hemlines and dramatic silhouettes</li><li>Bold prints and horizontal stripes</li></ul><h3>What to Avoid</h3><p>Very short hemlines that can look unbalanced on long legs. Ankle-length can look like full-length on you.</p><h2>Curvy (Hourglass)</h2><h3>Best Silhouettes</h3><ul><li>Wrap dresses and tops — highlight the waist</li><li>High-waisted pants with stretch</li><li>Fitted silhouettes that follow your natural curves</li><li>V-necklines that elongate the torso</li></ul><h3>What to Avoid</h3><p>Boxy, shapeless tops that hide your waist. Stiff fabrics that don\'t drape over curves.</p><h2>Athletic (Rectangle)</h2><h3>Best Silhouettes</h3><ul><li>Peplum tops and belts that create waist definition</li><li>A-line dresses and skirts</li><li>Layered tops that add volume</li><li>Textured fabrics and ruffles for dimension</li></ul><h3>What to Avoid</h3><p>Very structured, straight silhouettes that make you look boxy. Add softness and curves with styling.</p><h2>Apple (Wider Midsection)</h2><h3>Best Silhouettes</h3><ul><li>Empire waist dresses and tops</li><li>A-line cuts that flow from the bust down</li><li>Dark colors on top, brighter on bottom</li><li>V-necks and scoop necklines</li></ul><h3>What to Avoid</h3><p>Tight waistbands, tucked-in tops, and horizontal stripes at the midsection.</p><h2>Pear (Wider Hips/Thighs)</h2><h3>Best Silhouettes</h3><ul><li>Bootcut and wide-leg pants — balance the hips</li><li>Dark-colored bottoms, bright/patterned tops</li><li>A-line skirts and dresses</li><li>Statement necklines that draw the eye upward</li></ul><h3>What to Avoid</h3><p>Skinny jeans and tight-fitting bottoms that emphasize hip width. Very light-colored pants.</p><h2>Universal Confidence Tips</h2><ul><li>Wear the right size — not too tight, not too loose</li><li>Invest in good undergarments — they make every outfit look better</li><li>Stand tall — posture is the best accessory</li><li>Choose fabrics that feel good on your skin</li></ul><h2>FAQ</h2><h3>What if I\'m between two body types?</h3><p>Most women are! Combine the tips from both types and prioritize what feels most comfortable and flattering. Your body is unique — your style should be too.</p><h3>Do these tips work for all sizes?</h3><p>Yes! Body type styling works across all sizes. Tubhyam offers inclusive sizing from XS to 5XL so every woman can find her perfect fit.</p><h3>Can I wear something that\'s not "recommended" for my body type?</h3><p>Absolutely! These are guidelines, not rules. If you love something and feel confident, wear it. Confidence is the most flattering thing you can put on.</p>',
  },
  {
    title: 'Ethnic, Western, or Fusion? How to Choose the Right Outfit Every Time',
    slug: 'ethnic-western-fusion-choose-outfit',
    excerpt: 'The ultimate guide to choosing between ethnic, western, and fusion styles for any occasion.',
    category: 'Style Guide',
    keywords: ['ethnic vs western fashion', 'Indo western fusion', 'when to wear ethnic', 'modern Indian fashion'],
    readTime: 6,
    content: '<h2>The Three Style Worlds</h2><p>Indian women have a unique advantage — access to three distinct fashion traditions: ethnic (traditional Indian), western (global contemporary), and fusion (the best of both). Knowing when to choose which is a fashion superpower.</p><h2>When to Go Ethnic</h2><h3>Perfect For</h3><ul><li>Weddings and religious ceremonies</li><li>Festivals (Diwali, Eid, Navratri, Onam)</li><li>Family gatherings and traditional events</li><li>Cultural programs and pujas</li></ul><h3>Ethnic Go-To Outfits</h3><ul><li>Anarkali suit + jhumkas + juttis (festive)</li><li>Kurta + palazzo + dupatta (everyday ethnic)</li><li>Saree + statement jewelry (grand occasions)</li><li>Lehenga + choli (weddings)</li></ul><h2>When to Go Western</h2><h3>Perfect For</h3><ul><li>Office and professional settings</li><li>Job interviews and client meetings</li><li>Parties, clubs, and nights out</li><li>Casual outings, travel, and everyday errands</li></ul><h3>Western Go-To Outfits</h3><ul><li>Formal pants + blouse + blazer (office)</li><li>Jeans + tee + sneakers (casual)</li><li>Little black dress + heels (parties)</li><li>Shirt + jeans + loafers (smart-casual)</li></ul><h2>When to Go Fusion</h2><h3>Perfect For</h3><ul><li>Casual Fridays at work</li><li>Brunches and social gatherings</li><li>Pre-wedding events (sangeet, mehendi)</li><li>Art galleries, exhibitions, and creative spaces</li></ul><h3>Fusion Formulas That Always Work</h3><ul><li>Short kurta + jeans + juttis (casual fusion)</li><li>Ethnic print blouse + formal pants + heels (office fusion)</li><li>Crop top + palazzo + dupatta (festive fusion)</li><li>Western dress + ethnic jacket + jhumkas (creative fusion)</li></ul><h2>The Decision Framework</h2><p>Ask yourself these three questions:</p><ul><li><strong>What\'s the occasion?</strong> Formal/professional = western. Traditional = ethnic. In-between = fusion</li><li><strong>Who will be there?</strong> Match the dress code of the group while staying true to your style</li><li><strong>How do I want to feel?</strong> Powerful = structured western. Graceful = ethnic. Creative = fusion</li></ul><h2>Celebrity Fusion Inspiration</h2><p>Look at how Indian celebrities blend styles: Sonam Kapoor pairs sneakers with sarees, Deepika Padukone mixes ethnic jackets with western dresses, and Alia Bhatt rocks kurtas with jeans. Fusion isn\'t a compromise — it\'s a style statement.</p><h2>FAQ</h2><h3>Is fusion wear appropriate for traditional events?</h3><p>For most modern Indian events, yes. A well-done fusion look (ethnic top + western bottom + traditional jewelry) is both respectful and stylish. For very conservative events, lean more ethnic.</p><h3>Can I wear western clothes to an Indian wedding?</h3><p>It depends on the family and event. For the main ceremony, ethnic is safer. For cocktail parties and receptions, fusion or western works beautifully.</p><h3>How do I build a fusion wardrobe from scratch?</h3><p>Start with versatile pieces that work in multiple contexts: a neutral kurta (ethnic + jeans = fusion), formal pants (western + ethnic top = fusion), and statement earrings (work with everything).</p>',
  },
  {
    title: 'The Ultimate Color Guide for Indian Women: What to Wear When',
    slug: 'ultimate-color-guide-indian-women',
    excerpt: 'Master the art of color in fashion — from skin tone matching to seasonal palettes, this is your complete guide.',
    category: 'Color Guide',
    keywords: ['fashion color guide', 'what colors to wear', 'colors for skin tone', 'color combinations outfits'],
    readTime: 6,
    content: '<h2>Color Changes Everything</h2><p>The right color makes your skin glow, your eyes pop, and your overall look feel intentional. The wrong color can make you look washed out or tired. Here\'s how to master color in your wardrobe.</p><h2>Finding Your Skin Undertone</h2><p>Your undertone (not your skin color) determines which colors flatter you most.</p><h3>The Vein Test</h3><p>Look at the veins on your wrist in natural light:</p><ul><li><strong>Green veins</strong> = Warm undertone (yellow/golden base)</li><li><strong>Blue/purple veins</strong> = Cool undertone (pink/blue base)</li><li><strong>Hard to tell</strong> = Neutral undertone (mix of warm and cool)</li></ul><h2>Colors by Undertone</h2><h3>Warm Undertones (Most Indian Women)</h3><p>Your best colors: Earthy tones and warm shades.</p><ul><li>Mustard yellow, burnt orange, terracotta</li><li>Warm reds (tomato, coral)</li><li>Olive green, forest green</li><li>Warm browns, camel, gold</li><li>Cream and ivory (rather than pure white)</li></ul><h3>Cool Undertones</h3><p>Your best colors: Jewel tones and cool shades.</p><ul><li>Royal blue, navy, sapphire</li><li>Emerald green, teal</li><li>Plum, magenta, berry tones</li><li>Pure white, grey, black</li><li>Silver metallics</li></ul><h3>Neutral Undertones</h3><p>Your best colors: Almost everything works!</p><ul><li>Both warm and cool palettes</li><li>Mid-tones and soft shades</li><li>Dusty pink, jade green, cornflower blue</li><li>Both gold and silver metallics</li></ul><h2>Seasonal Color Palettes</h2><h3>Summer (March-June)</h3><p>Light, bright, and airy: white, pastels (mint, peach, lavender), light yellow, coral. Avoid very dark colors that absorb heat.</p><h3>Monsoon (July-September)</h3><p>Practical and bold: navy, black, deep green, jewel tones. Avoid very light colors that show mud stains.</p><h3>Festive Season (October-November)</h3><p>Rich and celebratory: gold, red, emerald, royal blue, orange, maroon. Go bold and festive!</p><h3>Winter (December-February)</h3><p>Deep and cozy: burgundy, forest green, mustard, chocolate brown, charcoal, navy. Rich, saturated colors feel warm and sophisticated.</p><h2>Power Colors for Confidence</h2><ul><li><strong>Red:</strong> Power, confidence, passion — wear to presentations and important meetings</li><li><strong>Blue:</strong> Trust, calm, professionalism — wear to interviews and client meetings</li><li><strong>Black:</strong> Authority, sophistication, slimming — universal confidence booster</li><li><strong>White:</strong> Freshness, clarity, modernity — wear for new beginnings</li><li><strong>Green:</strong> Growth, harmony — wear when you want to feel balanced</li></ul><h2>Color Combination Formulas That Always Work</h2><ul><li><strong>Navy + White:</strong> Classic, nautical, works for any occasion</li><li><strong>Black + Gold:</strong> Evening glamour and luxury</li><li><strong>Beige + Any Color:</strong> Beige is the ultimate neutral base</li><li><strong>Monochrome (all one color):</strong> Modern, expensive-looking, elongating</li></ul><h2>FAQ</h2><h3>Can I wear colors that aren\'t "recommended" for my undertone?</h3><p>Absolutely! Undertone guidelines are starting points, not rules. If a color makes you feel amazing, wear it regardless of "matching" your undertone.</p><h3>What\'s the most versatile color for Indian women?</h3><p>Navy blue. It flatters almost every Indian skin tone, works for all occasions, and pairs with every other color in your wardrobe.</p><h3>How do I add more color to my wardrobe?</h3><p>Start with accessories — a colorful bag, scarf, or pair of earrings. Then add one colorful bottom or top. Build your confidence gradually before going full-color.</p>',
  },
];

// ─── Keyword-based Inline Image Prompts ─────────────────────────────────────────
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
  'formal pants': ['formal pants collection with blazers and shirts on rack', 'tailored formal pants with belt heels and office accessories, flat lay'],
  'jeans': ['denim jeans collection in various washes on clothing rack', 'perfect jeans outfit with belt sneakers and casual accessories, flat lay'],
  'denim': ['denim fabric and jeans collection styled together, editorial photography', 'denim outfit pieces with accessories on clean surface, product shot'],
  'casual': ['casual outfit pieces with sneakers and crossbody bag, flat lay', 'relaxed everyday wear collection on wooden rack, boutique display'],
  'cargo': ['cargo pants with crop top and sneakers styled together, flat lay', 'utility fashion collection with cargo pieces and accessories, product shot'],
  'track pants': ['activewear track pants with sneakers on clean surface, product photography', 'sporty outfit collection with track pants and accessories, editorial'],
  'palazzo': ['flowing palazzo pants with fitted top and heels, boutique photography', 'wide-leg pants collection on clothing rack, fashion editorial'],
  'western wear': ['western outfit collection with tops and bottoms, boutique display', 'trendy western fashion pieces arranged together, flat lay photography'],
  'ootd': ['outfit of the day styled with accessories, Instagram flat lay', 'daily outfit inspiration with complete accessories, product photography'],
  'genz': ['gen-z fashion collection with baggy jeans and crop tops, neon studio', 'youthful trendy outfit pieces with layered accessories, modern display'],
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
  var h2Regex = /<\/h2>/gi;
  var matches = Array.from(htmlContent.matchAll(h2Regex));
  if (matches.length < 2) return htmlContent;

  var result = htmlContent;
  var offset = 0;
  var injectAfterIndices = [1, 3];
  var scenes = getInlineScenes(keyword);

  for (var j = 0; j < injectAfterIndices.length; j++) {
    var idx = injectAfterIndices[j];
    if (idx >= matches.length) continue;

    var match = matches[idx];
    var insertPos = match.index + match[0].length + offset;

    var scene = scenes[j % scenes.length];
    var prompt = 'Professional product photography, ' + scene + ', warm natural lighting, sharp focus, clean background, magazine quality, no text, no watermark';
    var seed = 'tubhyam-inline-v4-' + keyword.replace(/\s+/g, '-') + '-' + j + '-' + Math.floor(Math.random() * 99999);
    var imageUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=768&height=512&seed=' + seed + '&nologo=true&model=flux';

    var imgHtml = '<div style="margin:24px 0;border-radius:12px;overflow:hidden;border:1px solid rgba(212,175,55,0.2)"><img src="' + imageUrl + '" alt="' + topicLabel + ' fashion styling" style="width:100%;height:auto;display:block" loading="lazy"></div>';

    result = result.slice(0, insertPos) + imgHtml + result.slice(insertPos);
    offset += imgHtml.length;
  }

  return result;
}

// ─── Main Seeder ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB!');

  var existing = await Blog.countDocuments();
  if (existing > 0) {
    console.log('Clearing ' + existing + ' existing articles...');
    await Blog.deleteMany({});
  }

  console.log('\nSeeding 9 published articles with high-fidelity images...\n');

  for (var i = 0; i < ARTICLES.length; i++) {
    var article = ARTICLES[i];
    var kw = article.keywords[0] || 'women fashion';
    var prompt = buildImagePrompt(kw, article.category, i);
    var imageUrl = buildImageUrl(prompt, kw);
    var contentWithImages = injectInlineImages(article.content, kw, article.category);

    var blog = new Blog({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: contentWithImages,
      category: article.category,
      keywords: article.keywords,
      image: imageUrl,
      author: 'ianos',
      readTime: article.readTime,
      status: 'published',
      publishedAt: new Date(Date.now() - (ARTICLES.length - i) * 86400000),
    });

    await blog.save();
    console.log('  [' + (i + 1) + '/9] PUBLISHED: "' + article.title + '"');
    console.log('    Image: Flux model, 1280x720 landscape, seed=' + i);
  }

  console.log('\nDone! 9 articles published. Refresh /blog to see them.');
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

main().catch(function(err) {
  console.error('Fatal error:', err);
  process.exit(1);
});
