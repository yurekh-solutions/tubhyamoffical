import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Heart, Play, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import formal1 from '@/assets/formals/formal-7.jpeg';
import { api } from '@/config/api';
import { instagramConfig } from '@/config/instagramConfig';
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
  isVideo?: boolean;
}

const Lookbook = () => {
  const [feed, setFeed] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchPosts = async () => {
      try {
        const data = await api.get<{ success: boolean; posts: ApiInstagramPost[] }>('/instagram/posts?limit=12');
        if (!cancelled && data.success && data.posts && data.posts.length > 0) {
          setFeed(data.posts.map((post: ApiInstagramPost) => ({
            id: post.postId,
            image: post.mediaType === 'VIDEO' || post.mediaType === 'REEL'
              ? (post.thumbnailUrl || post.mediaUrl)
              : post.mediaUrl,
            caption: post.caption || 'Tubhyam Official',
            instagramUrl: post.permalink,
            likes: post.likesCount || 0,
            isVideo: post.mediaType === 'VIDEO' || post.mediaType === 'REEL',
          })));
          if (!cancelled) setIsLoading(false);
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
          isVideo: false,
        })));
        setIsLoading(false);
      }
    };
    fetchPosts();
    return () => { cancelled = true; };
  }, []);
  return (
    <>
      <SEO
        title="Lookbook | Fashion Inspiration"
        description="Explore Tubhyam's lookbook for premium women's fashion inspiration. Discover styling ideas for formal wear, jeans, and casual pants."
        keywords="fashion lookbook, women's style, outfit inspiration, premium fashion, Tubhyam lookbook"
        url="https://tubhyam.com/lookbook"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background z-10" />
          <img
            src={formal1}
            alt="Tubhyam Lookbook - Premium Women's Fashion"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 text-center py-12 sm:py-16">
          <p className="text-primary uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4 animate-fade-in">Season 2026</p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in">
            The <span className="text-gradient-gold">Lookbook</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in px-4">
            Discover our curated collection of style inspirations
          </p>
        </div>
      </section>

      {/* Gallery Grid - Dynamic Instagram Feed */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
            </div>
          ) : feed.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-primary/20">
                  <Instagram size={14} className="text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Live from{' '}
                    <a href={instagramConfig.profileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      @{instagramConfig.username}
                    </a>
                  </span>
                  <span className="text-xs text-muted-foreground">• Auto-refreshes</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {feed.map((post, index) => (
                  <a
                    key={post.id}
                    href={post.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer ${
                      index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className={`aspect-[3/4] ${index === 0 ? 'sm:aspect-auto sm:h-full' : ''}`}>
                      <img
                        src={post.image}
                        alt={post.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    {/* Video indicator */}
                    {post.isVideo && (
                      <div className="absolute top-3 right-3">
                        <Play className="w-5 h-5 text-white drop-shadow-lg" fill="white" />
                      </div>
                    )}

                    {/* Hover overlay with likes */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-2">
                          {post.likes !== undefined && (
                            <span className="flex items-center gap-1 text-white text-xs sm:text-sm font-semibold">
                              <Heart className="w-4 h-4" fill="white" />
                              {post.likes}
                            </span>
                          )}
                        </div>
                        <p className="text-white/90 text-xs sm:text-sm line-clamp-2 mb-2">{post.caption}</p>
                        <span className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-primary hover:text-white transition-colors">
                          View on Instagram <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Follow CTA */}
              <div className="text-center mt-10">
                <a
                  href={instagramConfig.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0095F6] hover:bg-[#1877F2] text-white px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105"
                >
                  <Instagram size={16} />
                  Follow @{instagramConfig.username}
                  <ExternalLink size={14} />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Instagram size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-heading text-xl mb-2">Stay Inspired</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Follow us on Instagram for daily style inspiration, new drops, and exclusive behind-the-scenes content.
              </p>
              <a
                href={instagramConfig.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0095F6] hover:bg-[#1877F2] text-white px-6 py-3 rounded-full font-medium text-sm transition-all"
              >
                <Instagram size={16} />
                Visit @{instagramConfig.username}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6">
            Ready to <span className="text-gradient-gold">Elevate Your Style?</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Explore our complete collection and find your perfect pair
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-base font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
          >
            Shop Collection
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Lookbook;
