import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, MessageCircle, Play, ArrowRight, Instagram } from 'lucide-react';
import logo from '@/assets/looo.png';

// Import actual product images for Instagram grid (fallback)
import img1 from '@/assets/formals/formal-1.jpeg';
import img2 from '@/assets/formals/formal-4.jpeg';
import img3 from '@/assets/formals/brown-formal.jpeg';
import img4 from '@/assets/formals/preuim-black.jpeg';
import img5 from '@/assets/formals/belt-formal-beige.jpeg';
import img6 from '@/assets/formals/olive-formal-belt.jpeg';
import img7 from '@/assets/formals/formal-7.jpeg';
import img8 from '@/assets/formals/formal-5.jpeg';

const fallbackPosts = [
  { image: img1, likes: 127, comments: 8, isVideo: false, permalink: '' },
  { image: img2, likes: 89, comments: 5, isVideo: true, permalink: '' },
  { image: img3, likes: 234, comments: 12, isVideo: false, permalink: '' },
  { image: img4, likes: 156, comments: 7, isVideo: false, permalink: '' },
  { image: img5, likes: 312, comments: 18, isVideo: false, permalink: '' },
  { image: img6, likes: 98, comments: 4, isVideo: true, permalink: '' },
  { image: img7, likes: 445, comments: 23, isVideo: false, permalink: '' },
  { image: img8, likes: 178, comments: 9, isVideo: false, permalink: '' },
];

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  like_count?: number;
  comments_count?: number;
}

const InstagramFeed = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [instagramPosts, setInstagramPosts] = useState(fallbackPosts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      const accessToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
      const userId = import.meta.env.VITE_INSTAGRAM_USER_ID;

      // If no credentials, use fallback images
      if (!accessToken || !userId) {
        console.log('Instagram API not configured, using fallback images');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,permalink,like_count,comments_count&access_token=${accessToken}&limit=8`
        );

        if (!response.ok) throw new Error('Failed to fetch Instagram posts');

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          const posts = data.data.map((post: InstagramPost) => ({
            image: post.media_url,
            likes: post.like_count || 0,
            comments: post.comments_count || 0,
            isVideo: post.media_type === 'VIDEO',
            permalink: post.permalink
          }));
          
          setInstagramPosts(posts);
        }
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        // Keep using fallback images
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <meta name="instagram:site" content="@tubhyamofficial" />
        <meta property="og:see_also" content="https://www.instagram.com/tubhyamofficial/" />
        <link rel="me" href="https://www.instagram.com/tubhyamofficial/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Tubhyam",
            "url": "https://tubhyam.com",
            "sameAs": ["https://www.instagram.com/tubhyamofficial/"],
            "description": "Premium women's fashion brand - तुम्हारे लिए (Made for You)"
          })}
        </script>
      </Helmet>

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-background via-secondary/20 to-background" aria-label="Instagram Feed">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-primary uppercase tracking-widest text-sm mb-4 font-semibold">
              Follow Us
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Join Our <span className="text-gradient-gold">Community</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              Get style inspiration and be the first to see new arrivals on Instagram
            </p>
          </div>

          {/* Instagram Profile Header - Like real Instagram widget */}
          <div className="max-w-5xl mx-auto mb-6 sm:mb-8">
            <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Profile Picture */}
                <a 
                  href="https://www.instagram.com/tubhyamofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={logo} 
                      alt="Tubhyam" 
                      className="w-full h-full rounded-full object-cover bg-background p-1"
                    />
                  </div>
                </a>
                
                {/* Profile Info & Stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <a 
                      href="https://www.instagram.com/tubhyamofficial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-heading font-bold text-lg sm:text-xl hover:text-primary transition-colors"
                    >
                      Tubhyam
                    </a>
                    <svg className="w-5 h-5 text-[#0095F6]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="text-sm text-muted-foreground">@tubhyamofficial</span>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
                    <span className="font-semibold"><strong className="text-foreground">24</strong> <span className="text-muted-foreground font-normal">posts</span></span>
                    <span className="font-semibold"><strong className="text-foreground">28.9K</strong> <span className="text-muted-foreground font-normal">followers</span></span>
                    <span className="font-semibold"><strong className="text-foreground">0</strong> <span className="text-muted-foreground font-normal">following</span></span>
                  </div>
                  
                </div>
                
                {/* Follow Button */}
                <a
                  href="https://www.instagram.com/tubhyamofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#0095F6] to-[#1877F2] hover:from-[#1877F2] hover:to-[#0095F6] text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="aspect-square bg-secondary/30 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                {instagramPosts.map((post, index) => (
                  <a
                    key={index}
                    href={post.permalink || "https://www.instagram.com/tubhyamofficial/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square overflow-hidden bg-secondary/30 cursor-pointer rounded-lg group hover:shadow-xl transition-all duration-300"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <img
                      src={post.image}
                      alt={`Instagram post ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Video indicator */}
                    {post.isVideo && (
                      <div className="absolute top-3 right-3">
                        <div className="p-2 bg-black/60 rounded-full backdrop-blur-sm">
                          <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Hover overlay with likes & comments */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-center gap-4 sm:gap-6 transition-opacity duration-300 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-white text-sm sm:text-base font-bold drop-shadow-lg">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-2 text-white text-sm sm:text-base font-bold drop-shadow-lg">
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                        {post.comments}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
            
            {/* Load More / View Profile */}
            <div className="text-center mt-6 sm:mt-8">
              <a
                href="https://www.instagram.com/tubhyamofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3.5 glass-card border-2 border-primary/30 hover:border-primary rounded-xl text-base font-semibold hover:bg-primary/5 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>View More on Instagram</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstagramFeed;