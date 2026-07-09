/**
 * INSTAGRAM STATIC FALLBACK
 * 
 * These posts display when the backend API is unavailable.
 * When the API returns real Instagram posts, they replace these fallbacks.
 * Updated manually to reflect the latest @tubhyamofficial content.
 */

export interface InstagramFallbackPost {
  id: string;
  caption: string;
  instagramUrl: string;
  likesCount: number;
}

export const instagramFallbackPosts: InstagramFallbackPost[] = [
  {
    id: 'fallback-01',
    caption: '✨ Elevate your formal look with our premium pleated waist pants. Available in Black, Beige & Green.',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 1247,
  },
  {
    id: 'fallback-02',
    caption: '🎀 Korean baggy plated pants — comfort meets style. Now available at ₹2000.',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 983,
  },
  {
    id: 'fallback-03',
    caption: '👖 Classic denim that never goes out of style. Shop the look on tubhyam.in',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 2156,
  },
  {
    id: 'fallback-04',
    caption: '🌿 Olive comfort pants — your everyday essential. Premium fabric, perfect fit.',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 834,
  },
  {
    id: 'fallback-05',
    caption: '🖤 Black formal trousers with belt — the ultimate power look. Limited stock!',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 1456,
  },
  {
    id: 'fallback-06',
    caption: '🤍 Beige formal — light, elegant, and absolutely stunning. Shop now!',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 1102,
  },
  {
    id: 'fallback-07',
    caption: '✨ New arrivals dropping soon! Stay tuned for exciting new styles.',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 2341,
  },
  {
    id: 'fallback-08',
    caption: '👗 Korean baggy formal pants with belt — redefining comfort fashion.',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 1678,
  },
  {
    id: 'fallback-09',
    caption: '🎯 Track pants are back! Black cargos and slim fits now restocked.',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 756,
  },
  {
    id: 'fallback-10',
    caption: '💫 Behind the scenes — crafting premium clothing that speaks confidence.',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 1923,
  },
  {
    id: 'fallback-11',
    caption: '🤎 Brown formal pants with matching belt — sophistication redefined.',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 887,
  },
  {
    id: 'fallback-12',
    caption: '🌟 Your style, your statement. Tag us @tubhyamofficial in your looks!',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likesCount: 3102,
  },
];

/** 
 * Use the Tubhyam logo or a product image as the fallback thumbnail.
 * This ensures the grid always has visual content even without the API.
 */
export const getFallbackImage = (index: number): string => {
  // Cycle through different gradient backgrounds for variety
  const gradients = [
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    'linear-gradient(135deg, #2d3436 0%, #636e72 50%, #b2bec3 100%)',
    'linear-gradient(135deg, #1e272e 0%, #485460 50%, #808e9b 100%)',
    'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #2980b9 100%)',
  ];
  // Return a data URI for a simple SVG placeholder
  // In production, replace with actual product images
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="%231a1a2e"/>
    <text x="200" y="180" text-anchor="middle" fill="%23c9a84c" font-size="24" font-weight="bold" font-family="sans-serif">TUBHYAM</text>
    <text x="200" y="220" text-anchor="middle" fill="%23999" font-size="13" font-family="sans-serif">@tubhyamofficial</text>
    <text x="200" y="250" text-anchor="middle" fill="%23666" font-size="11" font-family="sans-serif">Tap to view on Instagram</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
