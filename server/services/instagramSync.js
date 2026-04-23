 const axios = require('axios');
const InstagramPost = require('../models/InstagramPost');

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';

/**
 * Sync Instagram posts from @tubhyamofficial
 * Uses Instagram Basic Display API
 */
const syncInstagramPosts = async () => {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.log('Instagram access token not configured. Skipping sync.');
    return { synced: 0, updated: 0 };
  }

  try {
    // Step 1: Get user media
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
    // Handle token expiration
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Instagram token expired or invalid. Please refresh token.');
    }
    console.error('Instagram sync error:', error.response?.data?.error?.message || error.message);
    throw error;
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
  refreshAccessToken
};
