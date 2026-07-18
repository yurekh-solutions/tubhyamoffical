import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, MessageCircle, Play, Instagram, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/looo.png';
import { instagramConfig } from '@/config/instagramConfig';
import { api } from '@/config/api';
import { instagramFallbackPosts, getFallbackImage } from '@/data/instagramFallback';

interface ApiInstagramPost {
  postId: string;
  caption: string;
  mediaUrl: string;
  permalink: string;
  mediaType: string;
  thumbnailUrl?: string;
  likesCount: number;
  timestamp: string;
}

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  instagramUrl: string;
  likes?: number;
  comments?: number;
  isVideo?: boolean;
}

const InstagramFeed = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [feed, setFeed] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchInstagramPosts = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await api.get<{ success: boolean; posts: ApiInstagramPost[]; source?: string }>('/instagram/posts?limit=12');
      if (data.success && data.posts && data.posts.length > 0) {
        const mappedPosts: InstagramPost[] = data.posts.map(post => ({
          id: post.postId,
          image: post.mediaType === 'VIDEO' || post.mediaType === 'REEL'
            ? (post.thumbnailUrl || post.mediaUrl)
            : post.mediaUrl,
          caption: post.caption || 'Tubhyam Official',
          instagramUrl: post.permalink,
          likes: post.likesCount || 0,
          comments: 0,
          isVideo: post.mediaType === 'VIDEO' || post.mediaType === 'REEL',
        }));
        setFeed(mappedPosts);
        setLastFetch(new Date());
        setIsLoading(false);
        return;
      }
    } catch {
      // API failed — use static fallback below
    }
    // Use static fallback when API is unavailable
    setFeed(instagramFallbackPosts.map((post, i) => ({
      id: post.id,
      image: getFallbackImage(i),
      caption: post.caption,
      instagramUrl: post.instagramUrl,
      likes: post.likesCount,
      comments: 0,
    })));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchInstagramPosts(true);
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchInstagramPosts(false);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchInstagramPosts]);

  return (
    <>
      {/* SEO */}
      <Helmet>
        <meta name="instagram:site" content={`@${instagramConfig.username}`} />
        <meta property="og:see_also" content={instagramConfig.profileUrl} />
        <link rel="me" href={instagramConfig.profileUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": instagramConfig.displayName,
            "url": "https://www.tubhyam.in",
            "sameAs": [instagramConfig.profileUrl],
            "description": instagramConfig.bio
          })}
        </script>
      </Helmet>

      <section className="py-14 md:py-20 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="container mx-auto px-4">
          {/* Instagram Profile Header */}
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="glass-card p-4 sm:p-5 rounded-xl">
              <div className="flex items-center gap-3 sm:gap-5">
                {/* Profile Picture */}
                <a 
                  href={instagramConfig.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                    <img 
                      src={logo} 
                      alt={instagramConfig.displayName}
                      className="w-full h-full rounded-full object-cover bg-background"
                    />
                  </div>
                </a>
                
                {/* Profile Info & Stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a 
                      href={instagramConfig.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-base sm:text-lg hover:opacity-80 transition-opacity"
                    >
                      {instagramConfig.displayName}
                    </a>
                    <svg className="w-4 h-4 text-[#0095F6]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="text-xs sm:text-sm text-muted-foreground">@{instagramConfig.username}</span>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex items-center gap-3 sm:gap-5 mt-2 text-xs sm:text-sm">
                    <span><strong>{instagramConfig.posts}</strong> posts</span>
                    <span><strong>{instagramConfig.followers}</strong> followers</span>
                    <span className="hidden sm:inline"><strong>{instagramConfig.following}</strong> following</span>
                  </div>
                </div>
                
                {/* Follow Button */}
                <a
                  href={instagramConfig.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 bg-[#0095F6] hover:bg-[#1877F2] text-white rounded-lg font-medium text-xs sm:text-sm transition-all duration-300"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                    <circle cx="12" cy="12" r="3.2"/>
                    <circle cx="18.4" cy="5.6" r="1.44"/>
                  </svg>
                  Follow
                </a>
              </div>
            </div>
          </div>

          {/* Instagram Grid - 4 columns */}
          <div className="max-w-4xl mx-auto">
            {feed.length > 0 ? (
              <>
                {/* Live badge */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live from Instagram
                  </span>
                  {lastFetch && (
                    <span className="text-xs text-muted-foreground">
                      Updated {lastFetch.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  <button
                    onClick={() => fetchInstagramPosts(true)}
                    className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    title="Refresh feed"
                  >
                    <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-0.5 sm:gap-1">
                {feed.map((post, index) => (
                  <a
                    key={post.id}
                    href={post.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square overflow-hidden bg-secondary/30 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    title={post.caption}
                  >
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />

                    {/* Video indicator */}
                    {post.isVideo && (
                      <div className="absolute top-2 right-2">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg" fill="white" />
                      </div>
                    )}

                    {/* Hover overlay with likes & comments */}
                    <div
                      className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-3 sm:gap-5 transition-opacity duration-200 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {post.likes !== undefined && (
                        <span className="flex items-center gap-1 text-white text-xs sm:text-sm font-semibold">
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill="white" />
                          {post.likes}
                        </span>
                      )}
                      {post.comments !== undefined && post.comments > 0 && (
                        <span className="flex items-center gap-1 text-white text-xs sm:text-sm font-semibold">
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" fill="white" />
                          {post.comments}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm mb-4">Follow us on Instagram for the latest styles and updates</p>
                <a
                  href={instagramConfig.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0095F6] hover:bg-[#1877F2] text-white px-5 py-2 rounded-lg font-medium text-sm transition-all"
                >
                  <Instagram size={16} />
                  Follow @tubhyamofficial
                </a>
              </div>
            )}
            
            {/* Load More / View Profile */}
            <div className="text-center mt-4 sm:mt-6 flex items-center justify-center gap-4">
              <Link
                to="/instagram"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                View Gallery
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </Link>
              <span className="text-muted-foreground">|</span>
              <a
                href={instagramConfig.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                View on Instagram
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstagramFeed;
