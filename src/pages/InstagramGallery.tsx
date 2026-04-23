import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, MessageCircle, Play, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  likes: number;
  isVideo: boolean;
  timestamp: string;
}

const InstagramGallery = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<{ success: boolean; posts: ApiInstagramPost[]; totalCount: number }>('/instagram/posts?limit=50');
      if (data.success && data.posts) {
        const mappedPosts: InstagramPost[] = data.posts.map(post => ({
          id: post.postId,
          image: post.mediaType === 'VIDEO' || post.mediaType === 'REEL'
            ? (post.thumbnailUrl || post.mediaUrl)
            : post.mediaUrl,
          caption: post.caption || 'Tubhyam Official',
          instagramUrl: post.permalink,
          likes: post.likesCount || 0,
          isVideo: post.mediaType === 'VIDEO' || post.mediaType === 'REEL',
          timestamp: post.timestamp,
        }));
        setPosts(mappedPosts);
      }
    } catch (err) {
      setError('Failed to load Instagram posts. Please try again later.');
      console.error('Error fetching Instagram posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      await api.post('/instagram/sync', {});
      // Wait a moment then refetch
      setTimeout(fetchPosts, 2000);
    } catch (err) {
      console.error('Sync failed:', err);
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Instagram Gallery | Tubhyam</title>
        <meta name="description" content="Follow @tubhyamofficial on Instagram. Discover our latest styles, reels, and behind-the-scenes content." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen pt-20">
        {/* Header */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-background via-secondary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Home
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                  Instagram <span className="text-gradient-gold">Gallery</span>
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Follow @tubhyamofficial for daily style inspiration, new arrivals, and exclusive behind-the-scenes content.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSync}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 glass-card border border-primary/20 rounded-xl hover:border-primary/50 transition-all duration-300 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  <span className="text-sm font-medium">Sync</span>
                </button>
                <a
                  href="https://www.instagram.com/tubhyamofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <ExternalLink size={16} />
                  Follow Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="animate-pulse aspect-square bg-muted rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={fetchPosts}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw size={18} />
                  Try Again
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No Instagram posts found yet.</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Posts will appear here once your Instagram account is connected and synced.
                </p>
                <button
                  onClick={handleSync}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw size={18} />
                  Sync Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {posts.map((post, index) => (
                  <a
                    key={post.id}
                    href={post.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square overflow-hidden rounded-xl bg-secondary/30 group"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Video indicator */}
                    {post.isVideo && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" fill="white" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div
                      className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 sm:gap-3 transition-opacity duration-300 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill="white" />
                        {post.likes}
                      </span>
                      <p className="text-white/80 text-xs text-center px-3 line-clamp-2">
                        {post.caption}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default InstagramGallery;
