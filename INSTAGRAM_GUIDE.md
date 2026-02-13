# Instagram Feed Management Guide

## 📸 How to Add New Instagram Products

Your website displays selected Instagram products. Here's how to add new ones:

### Step-by-Step Process:

#### 1. **Save Instagram Image**
- Go to your Instagram post: https://www.instagram.com/tubhyamofficial/
- Download the image (right-click → Save image)
- Save it to: `src/assets/instagram/product-name.jpeg`
  - Example: `src/assets/instagram/black-formal-pants.jpeg`

#### 2. **Open Configuration File**
- Navigate to: `src/config/instagramConfig.ts`

#### 3. **Add Import Statement**
At the top of the file, add:
```typescript
import img9 from '@/assets/instagram/black-formal-pants.jpeg';
```

#### 4. **Add Product to Feed**
In the `instagramFeed` array, add a new entry:
```typescript
{
  id: 'post9',
  image: img9,
  caption: 'Black Formal Pants - Professional elegance',
  instagramUrl: 'https://www.instagram.com/p/ABC123xyz/',
  likes: 150,
  comments: 10,
  isVideo: false
}
```

#### 5. **Get Instagram Post ID**
- Open the Instagram post in browser
- Copy URL: `https://www.instagram.com/p/ABC123xyz/`
- The post ID is: `ABC123xyz`
- Replace `YOUR_POST_ID` with this in the `instagramUrl`

### Complete Example:

```typescript
// At top of instagramConfig.ts
import img9 from '@/assets/instagram/black-formal-pants.jpeg';

// In the instagramFeed array
export const instagramFeed: InstagramPost[] = [
  // ... existing posts ...
  {
    id: 'post9',
    image: img9,
    caption: 'Black Formal Pants - Professional elegance',
    instagramUrl: 'https://www.instagram.com/p/ABC123xyz/',
    likes: 150,
    comments: 10,
    isVideo: false  // Set to true if it's a Reel
  }
];
```

### Options:

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `id` | ✅ Yes | Unique identifier | `'post9'` |
| `image` | ✅ Yes | Imported image variable | `img9` |
| `caption` | ✅ Yes | Product description | `'Black Formal Pants'` |
| `instagramUrl` | ✅ Yes | Link to Instagram post | Full URL |
| `likes` | ❌ Optional | Number of likes | `150` |
| `comments` | ❌ Optional | Number of comments | `10` |
| `isVideo` | ❌ Optional | True for Reels/Videos | `false` |

### Tips:

✅ **Do:**
- Use clear, descriptive captions
- Save images with meaningful names
- Update follower count in `instagramConfig`
- Test on mobile after adding

❌ **Don't:**
- Use spaces in image filenames
- Forget to import the image
- Skip the post ID in URL
- Use very large images (compress if needed)

### Folder Structure:

```
src/
├── assets/
│   └── instagram/          ← Save Instagram images here
│       ├── product-1.jpeg
│       ├── product-2.jpeg
│       └── new-product.jpeg
├── config/
│   └── instagramConfig.ts  ← Manage feed here
└── components/
    └── InstagramFeed.tsx   ← Auto-updates from config
```

### Updating Stats:

To update Instagram stats (followers, posts):

```typescript
export const instagramConfig = {
  username: 'tubhyamofficial',
  profileUrl: 'https://www.instagram.com/tubhyamofficial/',
  displayName: 'Tubhyam',
  bio: 'Clothing that moves with confidence ✨',
  followers: '28.9K',  ← Update this
  posts: '20',          ← Update this
  following: '0'
};
```

## 🎨 Image Guidelines:

- **Format:** JPEG or PNG
- **Size:** Max 500KB (compress if larger)
- **Dimensions:** Square (1:1 ratio) recommended
- **Quality:** High resolution but compressed

## 🚀 After Adding Products:

1. Save all files
2. The website will automatically rebuild
3. Check the Instagram section on your homepage
4. Products appear in a 4-column grid
5. Click any product → Opens actual Instagram post

## ❓ Need Help?

If something doesn't work:
1. Check console for errors (F12 in browser)
2. Verify image path is correct
3. Ensure imports are at the top
4. Check there are no typos in URLs

---

**Current Feed:** Displays up to all products you add
**Layout:** 4 columns on desktop, responsive on mobile
**Updates:** Manual - you control which products show
