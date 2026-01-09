import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, MessageCircle, Play } from 'lucide-react';
import logo from '@/assets/looo.png';

// Import actual product images for Instagram grid
import img1 from '@/assets/formals/formal-1.jpeg';
import img2 from '@/assets/formals/formal-4.jpeg';
import img3 from '@/assets/formals/brown-formal.jpeg';
import img4 from '@/assets/formals/preuim-black.jpeg';
import img5 from '@/assets/formals/belt-formal-beige.jpeg';
import img6 from '@/assets/formals/olive-formal-belt.jpeg';
import img7 from '@/assets/formals/formal-7.jpeg';
import img8 from '@/assets/formals/formal-5.jpeg';

const instagramPosts = [
  { image: img1, likes: 127, comments: 8, isVideo: false },
  { image: img2, likes: 89, comments: 5, isVideo: true },
  { image: img3, likes: 234, comments: 12, isVideo: false },
  { image: img4, likes: 156, comments: 7, isVideo: false },
  { image: img5, likes: 312, comments: 18, isVideo: false },
  { image: img6, likes: 98, comments: 4, isVideo: true },
  { image: img7, likes: 445, comments: 23, isVideo: false },
  { image: img8, likes: 178, comments: 9, isVideo: false },
];

const InstagramFeed = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

      <section className="py-12 sm:py-16 md:py-20" aria-label="Instagram Feed">
        <div className="container mx-auto px-4">
          {/* Instagram Profile Header - Like real Instagram widget */}
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="glass-card p-4 sm:p-5 rounded-xl">
              <div className="flex items-center gap-3 sm:gap-5">
                {/* Profile Picture */}
                <a 
                  href="https://www.instagram.com/tubhyamofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                    <img 
                      src={logo} 
                      alt="Tubhyam" 
                      className="w-full h-full rounded-full object-cover bg-background"
                    />
                  </div>
                </a>
                
                {/* Profile Info & Stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a 
                      href="https://www.instagram.com/tubhyamofficial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-base sm:text-lg hover:opacity-80 transition-opacity"
                    >
                      Tubhyam
                    </a>
                    <svg className="w-4 h-4 text-[#0095F6]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="text-xs sm:text-sm text-muted-foreground">@tubhyamofficial</span>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex items-center gap-3 sm:gap-5 mt-2 text-xs sm:text-sm">
                    <span><strong>20</strong> posts</span>
                    <span><strong>28.9K</strong> followers</span>
                    <span className="hidden sm:inline"><strong>0</strong> following</span>
                  </div>
                </div>
                
                {/* Follow Button */}
                <a
                  href="https://www.instagram.com/tubhyamofficial/"
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

          {/* Instagram Grid - 4 columns like cellfix.in */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-4 gap-0.5 sm:gap-1">
              {instagramPosts.map((post, index) => (
                <a
                  key={index}
                  href="https://www.instagram.com/tubhyamofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden bg-secondary/30 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <img
                    src={post.image}
                    alt={`Instagram post ${index + 1}`}
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
                    <span className="flex items-center gap-1 text-white text-xs sm:text-sm font-semibold">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill="white" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1 text-white text-xs sm:text-sm font-semibold">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" fill="white" />
                      {post.comments}
                    </span>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Load More / View Profile */}
            <div className="text-center mt-4 sm:mt-6">
              <a
                href="https://www.instagram.com/tubhyamofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                  <circle cx="12" cy="12" r="3.2"/>
                  <circle cx="18.4" cy="5.6" r="1.44"/>
                </svg>
                View Profile on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstagramFeed;
