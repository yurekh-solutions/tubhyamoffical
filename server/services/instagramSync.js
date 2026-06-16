 const axios = require('axios');
const InstagramPost = require('../models/InstagramPost');

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';
const INSTAGRAM_USERNAME = 'tubhyamofficial';

/**
 * Scrape Instagram public profile page for posts
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
    // Try Instagram's internal API endpoint for user feed
    const response = await axios.get(
      `https://www.instagram.com/api/v1/feed/user/${INSTAGRAM_USERNAME}/username/`,
      {
        params: { count: limit },
        headers,
        timeout: 15000
      }
    );

    const items = response.data?.items || [];
    return items.map(item => ({
      id: item.id || item.pk,
      caption: item.caption?.text || '',
      mediaUrl: item.image_versions2?.candidates?.[0]?.url || item.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url || '',
      permalink: `https://www.instagram.com/p/${item.code}/`,
      mediaType: item.media_type === 2 || item.is_video ? 'VIDEO' : 'IMAGE',
      thumbnailUrl: item.image_versions2?.candidates?.[0]?.url || '',
      likeCount: item.like_count || 0,
      timestamp: new Date(item.taken_at * 1000),
    }));
  } catch (err) {
    console.error('Public profile scrape failed, trying fallback...');
    
    // Fallback: try the ?__a=1 JSON endpoint
    try {
      const fallbackRes = await axios.get(
        `https://www.instagram.com/${INSTAGRAM_USERNAME}/?__a=1&__d=1`,
        { headers: { ...headers, 'X-Requested-With': undefined }, timeout: 15000 }
      );
      const user = fallbackRes.data?.graphql?.user;
      const edges = user?.edge_owner_to_timeline_media?.edges || [];
      return edges.slice(0, limit).map(edge => {
        const node = edge.node;
        return {
          id: node.id,
          caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
          mediaUrl: node.display_url || node.thumbnail_src || '',
          permalink: `https://www.instagram.com/p/${node.shortcode}/`,
          mediaType: node.is_video ? 'VIDEO' : 'IMAGE',
          thumbnailUrl: node.thumbnail_src || node.display_url || '',
          likeCount: node.edge_liked_by?.count || 0,
          timestamp: new Date(node.taken_at_timestamp * 1000),
        };
      });
    } catch (fallbackErr) {
      console.error('All Instagram fetch methods failed:', fallbackErr.message);
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
