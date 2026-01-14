import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Check, Mail } from 'lucide-react';
import { useState } from 'react';
// Premium Collection Images
import formal1 from '@/assets/formals/brownbelt1.png';
import formal2 from '@/assets/formals/belt-formal-beige1.jpeg';
import formal3 from '@/assets/formals/olive-formal-belt.jpeg';
import formal4 from '@/assets/formals/formal-8.jpeg';
import jeans1 from '@/assets/products/jeans-3.jpg';
import jeans2 from '@/assets/products/jeans-33.jpg';
import track1 from '@/assets/Tracks/olivecomfort3.png';
import track2 from '@/assets/Tracks/olivecomfort.png';

const collections = [
  {
    id: 'formal',
    title: 'Formal Elegance',
    subtitle: 'Power Dressing Redefined',
    description: 'Sophisticated silhouettes for the modern professional. Command any boardroom with our premium formal collection featuring high-quality fabrics and impeccable tailoring.',
    images: [formal1, formal2, formal3],
    link: '/products?category=formal',
    badge: 'Best Seller'
  },
  {
    id: 'jeans',
    title: 'Denim Stories',
    subtitle: 'Timeless Comfort',
    description: 'Premium denim crafted for the perfect fit. From classic cuts to contemporary styles, each piece is designed to complement your unique style.',
    images: [jeans1, jeans2],
    link: '/products?category=jeans',
    badge: 'New Arrivals'
  },
  {
    id: 'track',
    title: 'Active Luxe',
    subtitle: 'Comfort Meets Style',
    description: 'Elevate your casual wardrobe with our premium track pants. Perfect for work-from-home, weekend outings, or athleisure styling with modern details.',
    images: [track1, track2],
    link: '/products?category=track',
    badge: 'Trending'
  },
  {
    id: 'premium',
    title: 'Premium Collection',
    subtitle: 'Season 2026',
    description: 'Luxurious fabrics meet contemporary design. Our premium collection features exclusive styles crafted for the discerning modern woman.',
    images: [formal4, formal1],
    link: '/products',
    badge: 'Limited Edition'
  }
];

const Collections = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSuccessMessage('Please enter a valid email address');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('✓ You will be notified when new collections drop!');
      setShowSuccess(true);
      setEmail('');
      setIsLoading(false);
      
      // Auto-hide after 4 seconds
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1000);
  };

  return (
    <>
      <SEO
        title="Collections | Seasonal Fashion"
        description="Explore Tubhyam's exclusive collections - Formal Elegance, Denim Stories, Active Luxe, and Summer Essentials. Premium women's fashion for every occasion."
        keywords="fashion collections, women's formal wear, denim collection, track pants, summer fashion, Tubhyam collections"
        url="https://tubhyam.com/collections"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center py-12 sm:py-16 md:py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 glass-card rounded-full mb-4 sm:mb-6">
            <Sparkles size={14} className="sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm">Curated for You</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6">
            Our <span className="text-gradient-gold">Collections</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Discover thoughtfully curated collections designed for the modern Indian woman
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16 sm:space-y-20 md:space-y-24">
            {collections.map((collection, index) => (
              <div
                key={collection.id}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 sm:gap-8 md:gap-12 items-center`}
              >
                {/* Images Grid */}
                <div className="flex-1 w-full">
                  <div className={`grid gap-3 sm:gap-4 ${
                    collection.images.length === 2 
                      ? 'grid-cols-2' 
                      : collection.images.length === 3 
                        ? 'grid-cols-2 sm:grid-cols-3'
                        : 'grid-cols-1'
                  }`}>
                    {collection.images.map((img, imgIndex) => (
                      <Link
                        key={imgIndex}
                        to={collection.link}
                        className={`group block relative overflow-hidden rounded-xl sm:rounded-2xl glass-card border border-white/20 ${
                          collection.images.length === 3 && imgIndex === 0 ? 'col-span-2 sm:col-span-1' : ''
                        }`}
                      >
                        <div className="aspect-[3/4] relative">
                          <img
                            src={img}
                            alt={`${collection.title} ${imgIndex + 1}`}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                          
                          {/* Badge on first image */}
                          {imgIndex === 0 && collection.badge && (
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                              {collection.badge}
                            </div>
                          )}
                          
                          {/* Hover Text */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <span className="text-white font-semibold text-sm sm:text-base px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/30">
                              View Collection
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 w-full lg:max-w-lg">
                  <p className="text-primary uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">{collection.subtitle}</p>
                  <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6">
                    {collection.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                    {collection.description}
                  </p>
                  <Link
                    to={collection.link}
                    className="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-primary text-primary-foreground rounded-full text-sm sm:text-base font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
                  >
                    Explore Collection
                    <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/20 via-background to-accent/10 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6">
            Stay <span className="text-gradient-gold">Ahead of Trends</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Be the first to know when new collections drop. Join our exclusive mailing list.
          </p>
          <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base bg-card/80 backdrop-blur border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base bg-primary text-primary-foreground rounded-full font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Notify Me
                </>
              )}
            </button>
          </form>
        </div>

        {/* Success Popup */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-[calc(100vw-2rem)] sm:max-w-none">
            <div className={`flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4 rounded-full glass-card backdrop-blur-xl border-2 ${
              successMessage.startsWith('✓')
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-amber-500/50 bg-amber-500/10'
            }`}>
              <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0 ${
                successMessage.startsWith('✓')
                  ? 'bg-green-500/20'
                  : 'bg-amber-500/20'
              }`}>
                <Check className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  successMessage.startsWith('✓')
                    ? 'text-green-500'
                    : 'text-amber-500'
                }`} />
              </div>
              <p className={`text-xs sm:text-sm font-medium ${
                successMessage.startsWith('✓')
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {successMessage}
              </p>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default Collections;
