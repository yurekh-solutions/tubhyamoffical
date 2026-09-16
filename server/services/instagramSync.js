 const axios = require('axios');
const InstagramPost = require('../models/InstagramPost');

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';
const INSTAGRAM_USERNAME = 'tubhyamofficial';

/**
 * Scrape Instagram public profile page for REELS only
 * Uses Instagram's public web API (no token needed)
 */
const fetchPublicProfile = async (limit = 12) => {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'X-Requested-With': 'XMLHttpRequest',
    'X-IG-App-ID': '936619743392459',
    'Referer': `https://www.instagram.com/${INSTAGRAM_USERNAME}/`,
  };

  try {
    // Try Instagram's reels endpoint specifically
    const response = await axios.get(
      `https://www.instagram.com/api/v1/clips/user/`,
      {
        params: { 
          target_user_id: INSTAGRAM_USERNAME,
          count: limit 
        },
        headers,
        timeout: 15000
      }
    );

    const items = response.data?.items || [];
    return items
      .filter(item => item.media_type === 2 || item.is_video) // Only videos/reels
      .slice(0, limit)
      .map(item => ({
        id: item.id || item.pk,
        caption: item.caption?.text || '',
        mediaUrl: item.image_versions2?.candidates?.[0]?.url || '',
        permalink: `https://www.instagram.com/reel/${item.code}/`,
        mediaType: 'REEL',
        thumbnailUrl: item.image_versions2?.candidates?.[0]?.url || '',
        likeCount: item.like_count || 0,
        timestamp: new Date(item.taken_at * 1000),
      }));
  } catch (err) {
    console.error('Reels scrape failed, trying user feed...', err.message);
    
    // Fallback: try user feed and filter for reels
    try {
      const response = await axios.get(
        `https://www.instagram.com/api/v1/feed/user/${INSTAGRAM_USERNAME}/username/`,
        {
          params: { count: limit * 2 },
          headers,
          timeout: 15000
        }
      );

      const items = response.data?.items || [];
      return items
        .filter(item => item.media_type === 2 || item.is_video) // Only videos/reels
        .slice(0, limit)
        .map(item => ({
          id: item.id || item.pk,
          caption: item.caption?.text || '',
          mediaUrl: item.image_versions2?.candidates?.[0]?.url || '',
          permalink: `https://www.instagram.com/reel/${item.code}/`,
          mediaType: 'REEL',
          thumbnailUrl: item.image_versions2?.candidates?.[0]?.url || '',
          likeCount: item.like_count || 0,
          timestamp: new Date(item.taken_at * 1000),
        }));
    } catch (feedErr) {
      console.error('User feed also failed:', feedErr.message);
      return [];
    }
  }
};

/**
 * Sync Instagram posts from @tubhyamofficial
 * Uses Instagram Basic Display API with fallback to public scraping
 */
const syncInstagramPosts = async () => {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.log('Instagram access token not configured. Using public profile scraping...');
    return syncFromPublicProfile();
  }

  try {
    // Step 1: Get user media via official API
    const mediaResponse = await axios.get(`${INSTAGRAM_API_BASE}/me/media`, {
      params: {
        fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
        access_token: accessToken,
        limit: 50
      }
    });

    const mediaItems = mediaResponse.data.data || [];
    
    let synced = 0;
    let updated = 0;

    for (const item of mediaItems) {
      const postData = {
        postId: item.id,
        caption: item.caption || '',
        mediaUrl: item.media_url || item.thumbnail_url || '',
        permalink: item.permalink,
        mediaType: item.media_type === 'VIDEO' ? 'REEL' : item.media_type,
        thumbnailUrl: item.thumbnail_url || item.media_url || '',
        timestamp: new Date(item.timestamp)
      };

      // Upsert post (update if exists, create if not)
      const result = await InstagramPost.findOneAndUpdate(
        { postId: item.id },
        postData,
        { upsert: true, new: true }
      );

      if (result.syncedAt && result.syncedAt > new Date(Date.now() - 60000)) {
        synced++;
      } else {
        updated++;
      }
    }

    console.log(`Instagram sync complete: ${synced} new, ${updated} updated`);
    return { synced, updated };

  } catch (error) {
    // Handle token expiration - fall back to public scraping
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Instagram token expired or invalid. Falling back to public scraping...');
      return syncFromPublicProfile();
    }
    console.error('Instagram sync error:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

/**
 * Sync from Instagram public profile (no token needed)
 */
const syncFromPublicProfile = async () => {
  try {
    const posts = await fetchPublicProfile(12);
    
    if (posts.length === 0) {
      console.log('No posts found from public profile.');
      return { synced: 0, updated: 0 };
    }

    let synced = 0;
    let updated = 0;

    for (const item of posts) {
      const postData = {
        postId: item.id,
        caption: item.caption || '',
        mediaUrl: item.mediaUrl,
        permalink: item.permalink,
        mediaType: item.mediaType === 'VIDEO' ? 'REEL' : item.mediaType,
        thumbnailUrl: item.thumbnailUrl || item.mediaUrl,
        timestamp: item.timestamp
      };

      const existing = await InstagramPost.findOne({ postId: item.id });
      if (!existing) {
        await InstagramPost.create(postData);
        synced++;
      } else {
        await InstagramPost.findOneAndUpdate({ postId: item.id }, postData);
        updated++;
      }
    }

    console.log(`Public profile sync complete: ${synced} new, ${updated} updated`);
    return { synced, updated };
  } catch (error) {
    console.error('Public profile sync error:', error.message);
    return { synced: 0, updated: 0 };
  }
};

/**
 * Refresh Instagram long-lived access token
 * Should be run before token expires (every 60 days)
 */
const refreshAccessToken = async () => {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) return null;

  try {
    const response = await axios.get(`${INSTAGRAM_API_BASE}/refresh_access_token`, {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: accessToken
      }
    });

    console.log('Instagram token refreshed successfully');
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to refresh Instagram token:', error.message);
    return null;
  }
};

module.exports = {
  syncInstagramPosts,
  refreshAccessToken,
  fetchPublicProfile,
  syncFromPublicProfile
};
