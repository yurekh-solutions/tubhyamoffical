// Seed high-quality blog posts for tubhyam.in/blog
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const MONGODB_URI = process.env.MONGODB_URI;

const BLOG_IMAGE_BASE = '/images/formals/';
const TRACKS_IMAGE_BASE = '/images/tracks/';
const PRODUCTS_IMAGE_BASE = '/images/products/';

const posts = [
  {
    title: 'How to Style Korean Baggy Formal Pants for Office & Beyond',
    slug: 'how-to-style-korean-baggy-formal-pants',
    excerpt: 'Discover how Korean baggy formal pants became the ultimate office-to-evening staple. Learn 5 styling formulas that work for meetings, brunches, and date nights.',
    category: 'Formal Pants',
    content: `
      <h2>The Rise of Korean Baggy Formal Pants</h2>
      <p>Korean fashion has taken the world by storm, and nowhere is this more evident than in the rise of baggy formal pants. These relaxed-yet-polished trousers have become the go-to choice for women who want to look professional without sacrificing comfort. The key lies in their high-waisted silhouette, wide-leg drape, and structured fabric that holds its shape throughout the day.</p>
      <figure style="margin: 32px 0;"><img src="${BLOG_IMAGE_BASE}formal-7.jpeg" alt="Korean baggy formal pants styling" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Korean baggy formal pants — the new office essential</figcaption></figure>

      <h2>5 Ways to Style Baggy Formal Pants</h2>
      <h3>1. The Power Meeting Look</h3>
      <p>Pair your baggy formal pants with a fitted blazer and a silk camisole. The contrast between the relaxed pants and structured top creates a balanced, authoritative silhouette. Add pointed-toe heels and minimal gold jewelry for a polished finish.</p>

      <h3>2. Casual Friday Vibes</h3>
      <p>Swap the blazer for an oversized knit sweater. Tuck the front slightly to define your waist. White sneakers or loafers complete this effortlessly chic look that says "I tried, but not too hard."</p>
      <figure style="margin: 32px 0;"><img src="${BLOG_IMAGE_BASE}formal-8.jpeg" alt="Casual Friday formal pants outfit" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Casual Friday: baggy pants + oversized knit</figcaption></figure>

      <h3>3. Evening Elegance</h3>
      <p>For after-work events, pair your formal pants with a body-hugging turtleneck and statement earrings. The wide-leg silhouette elongates your frame, making this one of the most flattering evening looks.</p>

      <h2>Fabric Matters: What to Look For</h2>
      <p>The secret to Korean baggy formal pants that look expensive lies in the fabric. Look for high-quality polyester blends with a slight stretch, or opt for wool-blend trousers for a more premium feel. The fabric should drape beautifully without clinging or wrinkling easily.</p>
      <figure style="margin: 32px 0;"><img src="${BLOG_IMAGE_BASE}beige formal.jpeg" alt="Premium formal pants fabric detail" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Premium fabric with perfect drape</figcaption></figure>

      <h2>Common Mistakes to Avoid</h2>
      <p>The biggest mistake with baggy formal pants is choosing the wrong length. They should graze the top of your shoes — not pool on the floor. Also, avoid pairing them with oversized tops on both halves; always balance volume with something fitted.</p>
    `,
    image: `${BLOG_IMAGE_BASE}formal-7.jpeg`,
    author: 'ainos',
    readTime: 6,
    status: 'published',
    publishedAt: new Date('2025-06-20'),
    focusKeyword: 'korean baggy formal pants',
    keywords: ['korean fashion', 'baggy pants', 'formal pants styling', 'office wear', 'wide leg pants'],
    tags: ['formal', 'korean', 'office wear', 'styling guide'],
    metaTitle: 'How to Style Korean Baggy Formal Pants | Tubhyam Style Journal',
    metaDescription: '5 proven styling formulas for Korean baggy formal pants. Office to evening looks, fabric guide, and common mistakes to avoid.',
    trendKeyword: 'korean baggy formal pants',
  },
  {
    title: 'The Ultimate Guide to Wide-Leg Jeans: Find Your Perfect Fit',
    slug: 'ultimate-guide-wide-leg-jeans',
    excerpt: 'Wide-leg jeans are having a major moment. Learn how to choose the right wash, length, and fit for your body type, plus 4 outfit formulas that always work.',
    category: 'Jeans',
    content: `
      <h2>Why Wide-Leg Jeans Are Everywhere</h2>
      <p>Wide-leg jeans have officially replaced skinny jeans as the denim silhouette of choice. The reason is simple: they're comfortable, flattering, and versatile. Whether you're running errands or heading to a dinner party, wide-leg jeans can be dressed up or down effortlessly.</p>
      <figure style="margin: 32px 0;"><img src="${PRODUCTS_IMAGE_BASE}jeans-3.jpg" alt="Wide-leg jeans styling" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">The perfect wide-leg jean silhouette</figcaption></figure>

      <h2>How to Choose the Right Wide-Leg Jeans</h2>
      <h3>1. The Rise</h3>
      <p>High-rise wide-leg jeans are the most universally flattering. They elongate your legs and define your waist. Mid-rise works well for petite frames, while low-rise is best reserved for tall women who want a retro look.</p>

      <h3>2. The Length</h3>
      <p>Full-length wide-leg jeans should hit just above the ground when worn with your go-to shoes. Cropped wide-leg jeans should end at the ankle bone. Avoid anything that drags on the floor — it looks sloppy, not stylish.</p>
      <figure style="margin: 32px 0;"><img src="${PRODUCTS_IMAGE_BASE}jeans-8.jpg" alt="Wide-leg jeans length guide" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Perfect length: grazing the shoe top</figcaption></figure>

      <h2>4 Outfit Formulas That Always Work</h2>
      <p><strong>Formula 1:</strong> Wide-leg jeans + fitted white tee + blazer + loafers. Classic, clean, works everywhere.</p>
      <p><strong>Formula 2:</strong> Wide-leg jeans + cropped sweater + ankle boots. Perfect for cooler days.</p>
      <p><strong>Formula 3:</strong> Wide-leg jeans + silk blouse + heels. Instant date-night outfit.</p>
      <p><strong>Formula 4:</strong> Wide-leg jeans + oversized shirt (tucked) + sneakers. Weekend uniform.</p>

      <h2>Denim Wash Guide</h2>
      <p>Dark wash wide-leg jeans are the most versatile — they work for both casual and semi-formal occasions. Light wash is perfect for summer and casual outings. Black wide-leg jeans are your evening go-to.</p>
    `,
    image: `${PRODUCTS_IMAGE_BASE}jeans-3.jpg`,
    author: 'ainos',
    readTime: 5,
    status: 'published',
    publishedAt: new Date('2025-06-15'),
    focusKeyword: 'wide-leg jeans guide',
    keywords: ['wide leg jeans', 'denim guide', 'jeans styling', 'baggy jeans', 'denim fit'],
    tags: ['jeans', 'denim', 'styling guide', 'fit guide'],
    metaTitle: 'Ultimate Wide-Leg Jeans Guide: Fit, Length & Styling | Tubhyam',
    metaDescription: 'Complete guide to wide-leg jeans — how to choose the right fit, length, wash, and 4 outfit formulas that always work.',
    trendKeyword: 'wide-leg jeans',
  },
  {
    title: 'Palazzo Pants Styling: 6 Looks for Every Occasion',
    slug: 'palazzo-pants-styling-every-occasion',
    excerpt: 'Palazzo pants are the most comfortable yet elegant bottoms in your wardrobe. Here are 6 complete outfit formulas from office to wedding.',
    category: 'Palazzo',
    content: `
      <h2>Why Palazzo Pants Are a Wardrobe Essential</h2>
      <p>Palazzo pants combine the comfort of pajamas with the elegance of a maxi skirt. Their flowing, wide-leg silhouette flatters every body type and works across seasons. The key to styling them is understanding proportion — since the pants are voluminous, your top should be more fitted.</p>
      <figure style="margin: 32px 0;"><img src="${BLOG_IMAGE_BASE}widelook.jpeg" alt="Palazzo pants elegant styling" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Flowing palazzo pants — comfort meets elegance</figcaption></figure>

      <h2>6 Palazzo Outfit Formulas</h2>
      <h3>1. Office Ready</h3>
      <p>Pair solid-color palazzo pants with a tucked-in button-down shirt and block heels. Add a structured tote and you're ready for any meeting.</p>

      <h3>2. Brunch Chic</h3>
      <p>Printed palazzo pants + simple white tank + strappy sandals + oversized sunglasses. Effortlessly put-together.</p>

      <h3>3. Wedding Guest</h3>
      <p>Silk or satin palazzo pants in jewel tones + embellished crop top + juttis or heels. Add statement jewelry for the complete look.</p>
      <figure style="margin: 32px 0;"><img src="${BLOG_IMAGE_BASE}widelook1.jpeg" alt="Palazzo pants wedding guest look" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Palazzo pants as wedding guest outfit</figcaption></figure>

      <h3>4. Casual Weekend</h3>
      <p>Cotton palazzo pants + oversized tee (front-tucked) + white sneakers. Comfortable enough for all-day wear.</p>

      <h2>Fabric Guide for Palazzo Pants</h2>
      <p><strong>Rayon/Viscose:</strong> Best drape, perfect for everyday. <strong>Georgette:</strong> Lightweight, great for summer. <strong>Silk/Satin:</strong> Premium feel, ideal for events. <strong>Cotton:</strong> Breathable, perfect for casual wear.</p>
    `,
    image: `${BLOG_IMAGE_BASE}widelook.jpeg`,
    author: 'ainos',
    readTime: 5,
    status: 'published',
    publishedAt: new Date('2025-06-10'),
    focusKeyword: 'palazzo pants styling',
    keywords: ['palazzo pants', 'wide leg pants', 'palazzo outfit', 'ethnic styling', 'comfortable fashion'],
    tags: ['palazzo', 'styling guide', 'ethnic', 'comfortable'],
    metaTitle: 'Palazzo Pants Styling: 6 Looks for Every Occasion | Tubhyam',
    metaDescription: '6 complete palazzo pants outfit formulas — office, brunch, wedding, casual. Plus fabric guide and proportion tips.',
    trendKeyword: 'palazzo pants',
  },
  {
    title: 'Cargo Pants Comeback: How to Wear Them in 2025',
    slug: 'cargo-pants-comeback-2025',
    excerpt: 'Cargo pants are back and better than ever. Learn how to style this utilitarian trend without looking like you are going on a hike.',
    category: 'Cargo',
    content: `
      <h2>The Cargo Pants Renaissance</h2>
      <p>Once written off as a 2000s mistake, cargo pants have made a sophisticated comeback. The new generation of cargo pants features cleaner lines, better fabrics, and more refined pocket placement. They're no longer just for hiking — they're a legitimate fashion statement.</p>
      <figure style="margin: 32px 0;"><img src="${TRACKS_IMAGE_BASE}buttoncargo.png" alt="Modern cargo pants styling" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Modern cargo pants — utilitarian meets fashion</figcaption></figure>

      <h2>How to Style Cargo Pants in 2025</h2>
      <h3>The Elevated Casual Look</h3>
      <p>Pair slim-fit cargo pants with a fitted turtleneck and Chelsea boots. The contrast between the utilitarian pants and refined top creates an interesting tension that looks intentionally styled.</p>

      <h3>Street Style Ready</h3>
      <p>Baggy cargo pants + cropped hoodie + chunky sneakers + crossbody bag. This is the look that's dominating Instagram and street style blogs.</p>
      <figure style="margin: 32px 0;"><img src="${TRACKS_IMAGE_BASE}buttoncargo1.png" alt="Cargo pants street style" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Street style: cargo pants + cropped top</figcaption></figure>

      <h2>Cargo Pants Do's and Don'ts</h2>
      <p><strong>Do:</strong> Choose cargo pants with minimal pocket bulk. <strong>Do:</strong> Balance volume with a fitted top. <strong>Don't:</strong> Wear cargo pants with another baggy item on top. <strong>Don't:</strong> Overload the pockets — it adds unnecessary bulk.</p>

      <h2>Best Colors for Cargo Pants</h2>
      <p>Olive green is the classic cargo color and remains the most versatile. Black cargo pants are the easiest to style for evening looks. Beige/khaki cargos work beautifully for summer outfits.</p>
    `,
    image: `${TRACKS_IMAGE_BASE}buttoncargo.png`,
    author: 'ainos',
    readTime: 4,
    status: 'published',
    publishedAt: new Date('2025-06-05'),
    focusKeyword: 'cargo pants styling 2025',
    keywords: ['cargo pants', 'cargo styling', 'street style', 'utilitarian fashion', '2025 trends'],
    tags: ['cargo', 'street style', 'trends', 'styling guide'],
    metaTitle: 'Cargo Pants Comeback: How to Wear Them in 2025 | Tubhyam',
    metaDescription: 'Cargo pants are back. Learn how to style this utilitarian trend with 4 outfit formulas and avoid common mistakes.',
    trendKeyword: 'cargo pants',
  },
  {
    title: 'Track Pants Beyond the Gym: Athleisure Outfit Ideas',
    slug: 'track-pants-athleisure-outfit-ideas',
    excerpt: 'Track pants have evolved from gym wear to everyday fashion. Discover how to style them for coffee runs, travel, and even casual office days.',
    category: 'Track Pants',
    content: `
      <h2>The Athleisure Revolution</h2>
      <p>Athleisure isn't just a trend — it's a lifestyle. Track pants have evolved from purely functional gym wear to fashion-forward pieces that work for multiple occasions. The key is choosing track pants with a refined silhouette and pairing them thoughtfully.</p>
      <figure style="margin: 32px 0;"><img src="${TRACKS_IMAGE_BASE}blackmom.png" alt="Athleisure track pants outfit" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Track pants: from gym to everyday style</figcaption></figure>

      <h2>5 Athleisure Outfit Formulas</h2>
      <h3>1. Coffee Run Chic</h3>
      <p>High-waisted track pants + oversized crewneck sweatshirt + white sneakers + baseball cap. Add a crossbody bag and you're ready for your morning latte.</p>

      <h3>2. Travel Comfort</h3>
      <p>Soft track pants + longline cardigan + slip-on sneakers + tote bag. Comfortable enough for a 6-hour flight, stylish enough for airport photos.</p>

      <h3>3. Casual Office Day</h3>
      <p>Tailored track pants (no visible logos) + blazer + simple tee + loafers. Yes, you can wear track pants to the office — if they look polished enough.</p>
      <figure style="margin: 32px 0;"><img src="${TRACKS_IMAGE_BASE}blackmom1.png" alt="Track pants casual office look" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Polished track pants for casual office days</figcaption></figure>

      <h2>Choosing the Right Track Pants</h2>
      <p>Look for track pants in solid colors without large logos. The fabric should have a slight sheen or texture that elevates them beyond basic sweatpants. Tapered or straight-leg silhouettes are more versatile than baggy styles.</p>
    `,
    image: `${TRACKS_IMAGE_BASE}blackmom.png`,
    author: 'ainos',
    readTime: 4,
    status: 'published',
    publishedAt: new Date('2025-06-01'),
    focusKeyword: 'track pants athleisure styling',
    keywords: ['track pants', 'athleisure', 'gym to street', 'casual styling', 'comfortable fashion'],
    tags: ['track pants', 'athleisure', 'casual', 'comfortable'],
    metaTitle: 'Track Pants Beyond the Gym: Athleisure Outfit Ideas | Tubhyam',
    metaDescription: '5 athleisure outfit formulas with track pants — coffee runs, travel, casual office. Plus how to choose the right pair.',
    trendKeyword: 'track pants athleisure',
  },
  {
    title: 'Belted Formal Looks: The Accessory That Transforms Any Outfit',
    slug: 'belted-formal-looks-accessory-guide',
    excerpt: 'A belt can completely transform a formal outfit. Learn how to choose the right belt style, width, and color to elevate your professional wardrobe.',
    category: 'Formal',
    content: `
      <h2>Why Belts Matter in Formal Wear</h2>
      <p>A belt is more than a functional accessory — it's a style statement that can define your waist, add visual interest, and pull an entire outfit together. In formal wear, the right belt signals attention to detail and polish.</p>
      <figure style="margin: 32px 0;"><img src="${BLOG_IMAGE_BASE}belt-formal-beige1.jpeg" alt="Formal belt styling" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">The right belt transforms any formal outfit</figcaption></figure>

      <h2>Belt Width Guide</h2>
      <p><strong>Thin belts (1-1.5 inches):</strong> Best for dresses, high-waisted pants, and delicate looks. <strong>Medium belts (1.5-2 inches):</strong> The most versatile — works with trousers, skirts, and coats. <strong>Wide belts (2+ inches):</strong> Make a statement, best worn over blazers or with simple outfits.</p>

      <h2>Color Matching Rules</h2>
      <p>The classic rule is to match your belt to your shoes. But modern styling allows more flexibility. A nude belt works with almost everything. Black and brown are the essential neutrals. For a pop of personality, try burgundy or tan.</p>
      <figure style="margin: 32px 0;"><img src="${BLOG_IMAGE_BASE}olive-formal-belt.jpeg" alt="Olive formal belt detail" style="width: 100%; height: auto; border-radius: 12px;" loading="lazy" /><figcaption style="text-align: center; font-size: 13px; color: #666; margin-top: 8px; font-style: italic;">Quality belt details that elevate your look</figcaption></figure>

      <h2>3 Belt Styling Formulas</h2>
      <p><strong>1. Over a blazer:</strong> Cinch an oversized blazer at the waist with a medium-width leather belt. Instantly more polished.</p>
      <p><strong>2. With high-waisted trousers:</strong> A thin belt through the loops of high-waisted formal pants adds a finished touch.</p>
      <p><strong>3. Over a dress:</strong> Transform a shift dress into a waist-defining silhouette with a statement belt.</p>
    `,
    image: `${BLOG_IMAGE_BASE}belt-formal-beige1.jpeg`,
    author: 'ainos',
    readTime: 4,
    status: 'published',
    publishedAt: new Date('2025-05-28'),
    focusKeyword: 'belt formal styling guide',
    keywords: ['belt styling', 'formal accessories', 'belt guide', 'professional style', 'accessories'],
    tags: ['formal', 'accessories', 'belt', 'styling guide'],
    metaTitle: 'Belted Formal Looks: The Accessory That Transforms Any Outfit | Tubhyam',
    metaDescription: 'How to choose and style belts for formal wear — width guide, color rules, and 3 outfit formulas that always work.',
    trendKeyword: 'formal belt styling',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check existing published posts
    const existing = await Blog.find({ status: 'published' });
    console.log(`Found ${existing.length} existing published posts`);

    let created = 0;
    for (const post of posts) {
      const exists = await Blog.findOne({ slug: post.slug });
      if (exists) {
        console.log(`  Skipping: ${post.title} (already exists)`);
        continue;
      }
      await Blog.create(post);
      created++;
      console.log(`  Created: ${post.title}`);
    }

    console.log(`\nDone! Created ${created} new posts. Total published: ${existing.length + created}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
