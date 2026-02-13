/**
 * Instagram Feed Configuration
 * 
 * HOW TO ADD NEW INSTAGRAM PRODUCTS:
 * 1. Save the Instagram image to: src/assets/instagram/
 * 2. Add a new entry below with image path, caption, and link
 * 3. The website will automatically display your selected products
 */

export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  instagramUrl: string;
  likes?: number;
  comments?: number;
  isVideo?: boolean;
}

// Import your Instagram product images
import img1 from '@/assets/formals/formal-1.jpeg';
import img2 from '@/assets/formals/formal-4.jpeg';
import img3 from '@/assets/formals/brown-formal.jpeg';
import img4 from '@/assets/formals/preuim-black.jpeg';
import img5 from '@/assets/formals/belt-formal-beige.jpeg';
import img6 from '@/assets/formals/olive-formal-belt.jpeg';
import img7 from '@/assets/formals/formal-7.jpeg';
import img8 from '@/assets/formals/formal-5.jpeg';
import img9 from '@/assets/Tracks/blackcargo1.png';
import img10 from '@/assets/Tracks/blackcargo2.png';
import img11 from '@/assets/formals/brownbelt1.png';
import img12 from '@/assets/formals/brownbelt2.png';

/**
 * INSTAGRAM PRODUCT FEED
 * 
 * To add a new product from Instagram:
 * 1. Download the image from Instagram post
 * 2. Save to: src/assets/instagram/product-name.jpeg
 * 3. Import it above (e.g., import img9 from '@/assets/instagram/product-name.jpeg')
 * 4. Add new entry below
 */
export const instagramFeed: InstagramPost[] = [
  {
    id: 'post1',
    image: img1,
    caption: 'Premium Brown Formal Pants - Perfect for office wear',
    instagramUrl: 'https://www.instagram.com/p/YOUR_POST_ID_1/',
    likes: 127,
    comments: 8,
    isVideo: false
  },
  {
    id: 'post2',
    image: img2,
    caption: 'Elegant Office Wear - Style meets comfort',
    instagramUrl: 'https://www.instagram.com/p/YOUR_POST_ID_2/',
    likes: 89,
    comments: 5,
    isVideo: true
  },
  {
    id: 'post3',
    image: img3,
    caption: 'Brown Formal Trousers - Classic elegance',
    instagramUrl: 'https://www.instagram.com/p/YOUR_POST_ID_3/',
    likes: 234,
    comments: 12,
    isVideo: false
  },
  {
    id: 'post4',
    image: img4,
    caption: 'Premium Black Formal Pants - Timeless style',
    instagramUrl: 'https://www.instagram.com/p/YOUR_POST_ID_4/',
    likes: 156,
    comments: 7,
    isVideo: false
  },
  {
    id: 'post5',
    image: img5,
    caption: 'Beige Belt Formal Pants - Sophisticated look',
    instagramUrl: 'https://www.instagram.com/p/YOUR_POST_ID_5/',
    likes: 312,
    comments: 18,
    isVideo: false
  },
  {
    id: 'post6',
    image: img6,
    caption: 'Olive Green Formal Pants - Nature-inspired elegance',
    instagramUrl: 'https://www.instagram.com/p/YOUR_POST_ID_6/',
    likes: 98,
    comments: 4,
    isVideo: true
  },
  {
    id: 'post7',
    image: img7,
    caption: 'Stylish Formal Pants - Make a statement',
    instagramUrl: 'https://www.instagram.com/p/YOUR_POST_ID_7/',
    likes: 445,
    comments: 23,
    isVideo: false
  },
  {
    id: 'post8',
    image: img8,
    caption: 'Classic Formal Trousers - Professional and chic',
    instagramUrl: 'https://www.instagram.com/p/YOUR_POST_ID_8/',
    likes: 178,
    comments: 9,
    isVideo: false
  },
  {
    id: 'post9',
    image: img9,
    caption: 'Black Cargo Pants - Effortless casual style',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likes: 245,
    comments: 15,
    isVideo: false
  },
  {
    id: 'post10',
    image: img10,
    caption: 'Black Cargo - Urban streetwear vibes',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likes: 198,
    comments: 11,
    isVideo: false
  },
  {
    id: 'post11',
    image: img11,
    caption: 'Brown Belt Formal Pants - Elegant finish',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likes: 267,
    comments: 14,
    isVideo: false
  },
  {
    id: 'post12',
    image: img12,
    caption: 'Brown Belt Trousers - Refined sophistication',
    instagramUrl: 'https://www.instagram.com/tubhyamofficial/',
    likes: 189,
    comments: 8,
    isVideo: false
  }
];

/**
 * Instagram Account Configuration
 */
export const instagramConfig = {
  username: 'tubhyamofficial',
  profileUrl: 'https://www.instagram.com/tubhyamofficial/',
  displayName: 'Tubhyam',
  bio: 'Clothing that moves with confidence ✨ Made for her, inspired by her',
  followers: '28.9K',
  posts: '20',
  following: '0'
};

/**
 * HOW TO UPDATE:
 * 
 * When you add a new product to Instagram:
 * 1. Download the image
 * 2. Save to: src/assets/instagram/
 * 3. Add import at top: import img9 from '@/assets/instagram/new-product.jpeg'
 * 4. Add new object to instagramFeed array above
 * 5. Replace YOUR_POST_ID with actual Instagram post ID (from URL)
 * 
 * Example Instagram URL: https://www.instagram.com/p/ABC123xyz/
 * The post ID is: ABC123xyz
 */
