# Instagram Feed Integration Setup

This guide will help you set up real-time Instagram feed integration for your Tubhyam website.

## Quick Summary

**What You Need:**
1. Instagram Business/Creator account (@tubhyamofficial)
2. Facebook Page connected to your Instagram
3. Facebook Developer account (free)
4. 15-20 minutes to complete setup

**What You'll Get:**
- Real-time Instagram posts on your website
- Automatically updates when you post on Instagram
- Shows your latest 8 posts with likes and comments

**Simple Steps:**
1. Convert Instagram to Business account (if needed)
2. Connect to Facebook Page
3. Create Facebook Developer App
4. Generate Access Token
5. Get your User ID
6. Add to `.env` file
7. Done! ✅

## Overview

The website now automatically fetches the latest 8 posts from your Instagram account (@tubhyamofficial) and displays them in the Instagram Feed section. When you upload new content to Instagram, it will automatically reflect on your website.

## Visual Flow

```
[Instagram @tubhyamofficial] 
         ↓
    Post new photo
         ↓
  [Instagram API] ← (Access Token)
         ↓
  [Your Website] 
         ↓
   Displays automatically!
   (Refreshes every page load)
```

## How to Get Access Token (Simple Version)

**Option 1: Quick Setup (Recommended)**

1. **Visit**: https://developers.facebook.com/
2. **Create App** → Choose "Business"
3. **Add Product** → Select "Instagram Basic Display"
4. **Add Tester** → Add @tubhyamofficial
5. **Accept on Phone** → Instagram app → Settings → Apps → Accept invite
6. **Generate Token** → Copy the long text string
7. **Paste in `.env`** file

**Option 2: Use Third-Party Service (Easier but costs money)**
- [Elfsight Instagram Feed](https://elfsight.com/instagram-feed-instashow/)
- [SnapWidget](https://snapwidget.com/)
- [Juicer.io](https://www.juicer.io/)

These handle token management automatically.

## Features

- **Real-time Instagram Posts**: Fetches latest 8 posts from @tubhyamofficial
- **Auto-refresh**: New Instagram posts automatically appear on the website
- **Fallback Images**: Uses local product images if Instagram API is not configured
- **Engagement Metrics**: Shows likes and comments count
- **Video Support**: Identifies and displays video posts with play icon
- **Direct Links**: Each post links to the original Instagram post

## Setup Instructions

### Prerequisites

1. **Instagram Business or Creator Account** - You need to convert your personal Instagram account (@tubhyamofficial) to a Business or Creator account
2. **Facebook Page** - Your Instagram Business account must be connected to a Facebook Page
3. **Facebook Developer Account** - Free to create at developers.facebook.com

### Step 1: Convert Instagram to Business Account (If Not Already)

1. Open Instagram app on your phone
2. Go to your profile → Settings → Account
3. Tap "Switch to Professional Account"
4. Choose "Business" or "Creator"
5. Complete the setup

### Step 2: Connect Instagram to Facebook Page

1. Go to your Facebook Page settings
2. Click on "Instagram" in the left sidebar
3. Click "Connect Account"
4. Log in with your Instagram credentials
5. Authorize the connection

### Step 3: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** in the top right
3. Click **"Create App"**
4. Choose **"Business"** as app type
5. Fill in details:
   - **App Name**: "Tubhyam Website" (or any name)
   - **App Contact Email**: Your email
6. Click **"Create App"**

### Step 4: Add Instagram Basic Display

1. In your new app dashboard, scroll down to **"Add Products"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. Click **"Create New App"** at the bottom
4. Accept the terms
5. Click **"Basic Display"** in the left sidebar

### Step 5: Configure Instagram App

1. In **"Basic Display"** section:
   - **Valid OAuth Redirect URIs**: `https://tubhyam.com/`
   - **Deauthorize Callback URL**: `https://tubhyam.com/`
   - **Data Deletion Request URL**: `https://tubhyam.com/`
2. Click **"Save Changes"**
3. Scroll down to **"User Token Generator"**
4. Click **"Add or Remove Instagram Testers"**
5. Add your Instagram account (@tubhyamofficial)

### Step 6: Accept Tester Invitation

1. Open Instagram app on your phone
2. Go to Settings → Apps and Websites
3. Under "Tester Invites", accept the invitation

### Step 7: Generate Access Token

1. Go back to Facebook Developers
2. In **"Basic Display"** → **"User Token Generator"**
3. Click **"Generate Token"** next to your Instagram account
4. Log in with Instagram if prompted
5. Click **"Authorize"**
6. **Copy the Access Token** - This is your `VITE_INSTAGRAM_ACCESS_TOKEN`

**IMPORTANT**: This is a short-lived token (expires in 1 hour). To get a long-lived token (60 days):

```bash
https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=YOUR_SHORT_LIVED_TOKEN
```

### Step 8: Get Your Instagram User ID

**Method 1: Using Access Token**

Paste this in your browser (replace YOUR_ACCESS_TOKEN):
```
https://graph.instagram.com/me?fields=id,username&access_token=YOUR_ACCESS_TOKEN
```

This will return:
```json
{
  "id": "1234567890",
  "username": "tubhyamofficial"
}
```

**Method 2: Using Online Tool**

1. Visit [Instagram User ID Finder](https://codeofaninja.com/tools/find-instagram-user-id/)
2. Enter: `tubhyamofficial`
3. Click **"Find Instagram ID"**
4. Copy the numeric ID

### Step 9: Configure Environment Variables

1. Open your `.env` file in the project root
2. Add your Instagram credentials:

```env
# Instagram API Configuration
VITE_INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
VITE_INSTAGRAM_USER_ID=your_instagram_business_account_id_here
```

### Step 10: Test the Integration

1. Restart your development server:
```bash
npm run dev
```

2. Visit the homepage and scroll to the Instagram Feed section
3. You should see your latest 8 Instagram posts

## Important Notes

### Access Token Expiration

- **Short-lived tokens**: Expire in 1 hour
- **Long-lived tokens**: Last for 60 days
- You need to refresh your token before it expires
- Consider setting up automatic token refresh

### API Limitations

- **Rate Limits**: Instagram Graph API has rate limits
- **Business Account Required**: You need an Instagram Business or Creator account
- **Facebook Page**: Your Instagram must be connected to a Facebook Page

### Fallback Behavior

If Instagram API is not configured or fails:
- Website will display 8 fallback product images
- No errors will be shown to users
- Check browser console for debugging information

## Troubleshooting

### Can't Find "Generate Token" Button

**Problem**: User Token Generator section is empty or no button visible

**Solution**:
1. Make sure you added Instagram account as a tester (Step 5)
2. Check that you accepted the tester invitation on Instagram app (Step 6)
3. Wait a few minutes after accepting invitation
4. Refresh the Facebook Developers page

### "Invalid Access Token" Error

**Problem**: Access token doesn't work or expires quickly

**Solution**:
1. Short-lived tokens expire in 1 hour - exchange for long-lived token
2. Use this URL to get 60-day token:
   ```
   https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=YOUR_SHORT_TOKEN
   ```
3. Find your App Secret in Facebook Developer App Settings → Basic

### "Instagram Account Not Eligible"

**Problem**: Can't generate token or connect account

**Solution**:
1. Ensure Instagram account is **Business** or **Creator** (not Personal)
2. Verify Instagram is connected to a Facebook Page
3. Check that Facebook Page is not restricted or banned
4. Use the same Facebook account for both Page and Developer Console

### Posts Not Showing

1. **Check API credentials**: Verify your access token and user ID are correct
2. **Check token expiration**: Access tokens expire and need to be refreshed
3. **Check account type**: Ensure you have an Instagram Business or Creator account
4. **Check console**: Open browser developer console for error messages

### CORS Errors

- Instagram Graph API should not have CORS issues
- If you see CORS errors, your access token might be invalid

### Token Refresh

To get a long-lived token (60 days):

```bash
https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_ACCESS_TOKEN
```

## Alternative: Instagram Widget Embed

If you prefer a simpler solution without API setup:

1. Use Instagram's official embed widget
2. Or use third-party services like Elfsight, SnapWidget, or Juicer.io
3. These services handle token refresh automatically

## Support

For issues or questions:
- Check [Instagram Platform Documentation](https://developers.facebook.com/docs/instagram)
- Contact your developer for assistance
- Refer to `.env.example` for configuration format

### Helpful Video Tutorials

- [How to Get Instagram Access Token (YouTube)](https://www.youtube.com/results?search_query=instagram+basic+display+api+access+token)
- [Instagram Business Account Setup](https://www.youtube.com/results?search_query=convert+instagram+to+business+account)
- [Connect Instagram to Facebook Page](https://www.youtube.com/results?search_query=connect+instagram+to+facebook+page)

### Alternative: Embed Instagram Feed Widget

If the API setup is too complex, you can use Instagram's embed feature:

1. Go to [Instagram Embed Generator](https://www.instagram.com/tubhyamofficial/embed/)
2. Or use services like:
   - **Behold** (https://behold.so/) - Free for basic use
   - **EmbedSocial** (https://embedsocial.com/products/embedfeed/)
   - **Curator.io** (https://curator.io/)

These services provide simple copy-paste code with automatic token refresh.

## Current Status

- ✅ Instagram Feed component created
- ✅ Real-time API integration ready
- ✅ Fallback images configured
- ⏳ Waiting for Instagram API credentials to enable live feed

Once you add your Instagram credentials to the `.env` file, the live feed will automatically activate!
