import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, MessageCircle, Play, Instagram, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import PageLoader from '@/components/PageLoader';
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
  timestamp: string;
}

const InstagramGallery = () => {
  const [feed, setFeed] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchPosts = async () => {
      try {
        const data = await api.get<{ success: boolean; posts: ApiInstagramPost[] }>('/instagram/posts?limit=24');
        if (!cancelled && data.success && data.posts) {
          const mapped = data.posts.map(post => ({
            id: post.postId,
            image: post.mediaType === 'VIDEO' || post.mediaType === 'REEL'
              ? (post.thumbnailUrl || post.mediaUrl)
              : post.mediaUrl,
            caption: post.caption || 'Tubhyam Official',
            instagramUrl: post.permalink,
            likes: post.likesCount || 0,
            comments: 0,
            isVideo: post.mediaType === 'VIDEO' || post.mediaType === 'REEL',
            timestamp: post.timestamp
          }));
          if (!cancelled) {
            setFeed(mapped);
            setIsLoading(false);
          }
          return;
        }
      } catch {
        // API failed — use static fallback below
      }
      // Use static fallback when API is unavailable
      if (!cancelled) {
        setFeed(instagramFallbackPosts.map((post, i) => ({
          id: post.id,
          image: getFallbackImage(i),
          caption: post.caption,
          instagramUrl: post.instagramUrl,
          likes: post.likesCount,
          comments: 0,
          isVideo: false,
          timestamp: new Date().toISOString(),
        })));
        setIsLoading(false);
      }
    };
    fetchPosts();
    return () => { cancelled = true; };
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Instagram | Tubhyam Official"
        description="Follow @tubhyamofficial on Instagram for the latest styles, behind-the-scenes, and exclusive drops."
        url="https://tubhyam.in/instagram"
      />
      <Helmet>
        <meta name="instagram:site" content={`@${instagramConfig.username}`} />
      </Helmet>
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Instagram size={16} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Follow Us</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              @<span className="text-gradient-gold">{instagramConfig.username}</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Clothing that moves with confidence. Follow us for daily style inspiration,
              new drops, and exclusive behind-the-scenes content.
            </p>
            <a
              href={instagramConfig.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0095F6] hover:bg-[#1877F2] text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
            >
              <Instagram size={18} />
              Follow on Instagram
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <PageLoader message="Loading Instagram feed" />
          ) : feed.length > 0 ? (
            <>
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-2">
                  {feed.map((post, index) => (
                    <a
                      key={post.id}
                      href={post.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-square overflow-hidden bg-secondary/30 cursor-pointer group"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      title={post.caption}
                    >
                      <img
                        src={post.image}
                        alt={post.caption}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Video indicator */}
                      {post.isVideo && (
                        <div className="absolute top-2 right-2">
                          <Play className="w-4 h-4 text-white drop-shadow-lg" fill="white" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div
                        className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 ${
                          hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        {post.likes !== undefined && (
                          <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
                            <Heart className="w-4 h-4" fill="white" />
                            {post.likes}
                          </span>
                        )}
                        {post.comments !== undefined && post.comments > 0 && (
                          <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
                            <MessageCircle className="w-4 h-4" fill="white" />
                            {post.comments}
                          </span>
                        )}
                        <span className="text-white/70 text-xs mt-1">
                          {formatDate(post.timestamp)}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* View More on Instagram */}
              <div className="text-center mt-10">
                <a
                  href={instagramConfig.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  View more on Instagram
                  <ExternalLink size={16} />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Instagram size={48} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="font-heading text-2xl mb-2">No posts yet</h2>
              <p className="text-muted-foreground mb-6">
                Follow us on Instagram to see our latest styles and updates.
              </p>
              <a
                href={instagramConfig.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0095F6] hover:bg-[#1877F2] text-white px-6 py-3 rounded-full font-medium transition-all"
              >
                <Instagram size={18} />
                Visit @tubhyamofficial
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InstagramGallery;
