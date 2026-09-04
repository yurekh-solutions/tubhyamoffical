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
 * Map each fallback post to a real product image.
 * This ensures the grid always has visual content even without the API.
 */
const fallbackImages = [
  '/images/products/beggyplatedkoreanfront.jpg',
  '/images/products/blackstraight.jpg',
  '/images/products/frontdenim.jpg',
  '/images/products/brownbelt.jpg',
  '/images/products/cargo.jpg',
  '/images/products/blackmom.jpg',
  '/images/products/beige-formal.jpg',
  '/images/products/olivecomfort.jpg',
  '/images/products/track-1.jpg',
  '/images/products/belt-formal-beige.jpg',
  '/images/products/brown-formal.jpg',
  '/images/products/jeans-1.jpg',
];

export const getFallbackImage = (index: number): string => {
  return fallbackImages[index % fallbackImages.length];
};
