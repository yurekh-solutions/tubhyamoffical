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

/**
 * INSTAGRAM FEED
 *
 * This feed is populated dynamically from the API.
 * To enable live Instagram posts, add your Instagram Basic Display API token
 * to server/.env as INSTAGRAM_ACCESS_TOKEN=your_token_here
 */
export const instagramFeed: InstagramPost[] = [];

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
