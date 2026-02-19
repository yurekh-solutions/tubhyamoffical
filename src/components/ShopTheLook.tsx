import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { products } from '@/data/products';

const ShopTheLook = () => {
  const [activeSlide, setActiveSlide] = useState(2); // Start with center item
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get all formal products with images for the lookbook, excluding specific products
  const excludedIds = ['fp-005', 'fp-008']; // Olive Sophisticated Pants, Teal Statement Trousers
  const lookProducts = products
    .filter(p => p.category === 'formal' && p.images.length > 0 && !excludedIds.includes(p.id));

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % lookProducts.length);
    }, 4000); // Slightly longer interval for better viewing

    return () => clearInterval(interval);
  }, [isAutoPlaying, lookProducts.length]);

  const handlePrevious = () => {
    setActiveSlide((prev) => (prev - 1 + lookProducts.length) % lookProducts.length);
    // Reset autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % lookProducts.length);
    // Reset autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getSlidePosition = (index: number) => {
    const diff = index - activeSlide;
    const total = lookProducts.length;
    
    // Calculate circular distance
    let position = diff;
    if (diff > total / 2) position = diff - total;
    if (diff < -total / 2) position = diff + total;
    
    return position;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-widest text-sm mb-4 font-semibold">
            Shop The Look
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Style Your <span className="text-gradient-gold">Perfect Outfit</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover curated looks featuring our premium collection
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[420px] sm:h-[500px] md:h-[600px]">
          <div className="absolute inset-0 flex items-center justify-center">
            {lookProducts.map((product, index) => {
              const position = getSlidePosition(index);
              const isActive = position === 0;
              const isAdjacent = Math.abs(position) === 1;
              const isVisible = Math.abs(position) <= 2;

              if (!isVisible) return null;

              return (
                <div
                  key={product.id}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    transform: `
                      translateX(${
                        position *
                        (window.innerWidth < 640
                          ? 200
                          : window.innerWidth < 768
                          ? 240
                          : 280)
                      }px)
                      translateZ(${isActive ? 0 : -200}px)
                      scale(${isActive ? 1 : isAdjacent ? 0.85 : 0.7})
                    `,
                    zIndex: isActive ? 30 : isAdjacent ? 20 : 10,
                    opacity: isActive ? 1 : isAdjacent ? 0.7 : 0.4,
                  }}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  {/* Card */}
                  <div 
                    className={`relative overflow-hidden rounded-2xl transition-all duration-700 ${
                      isActive
                        ? 'w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[480px]'
                        : 'w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96'
                    }`}
                  >
                    {/* Image with zoom effect */}
                    <div className="relative w-full h-full overflow-hidden group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          isActive ? 'group-hover:scale-110' : ''
                        }`}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Badges */}
                      {isActive && (
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                              New
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium">
                              Bestseller
                            </span>
                          )}
                        </div>
                      )}

                      {/* Product Info Overlay - Only on active slide */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="font-heading text-lg md:text-xl font-bold text-white mb-1 md:mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-white/80 text-xs md:text-sm mb-3 md:mb-4 line-clamp-1 capitalize">
                            {product.category}
                          </p>
                          <Link
                            to={`/product/${product.id}`}
                            className="inline-flex items-center gap-2 bg-white text-black px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
                          >
                            <ShoppingBag size={18} />
                            View Details
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Border glow for active card */}
                    {isActive && (
                      <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl pointer-events-none" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 md:p-4 glass-card border border-primary/20 rounded-full hover:border-primary/50 transition-all duration-300 hover:scale-110 group"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 md:p-4 glass-card border border-primary/20 rounded-full hover:border-primary/50 transition-all duration-300 hover:scale-110 group"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="hidden flex justify-center gap-2 mt-8 md:mt-12">
          {lookProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveSlide(index);
                // Resume autoplay after 8 seconds
                setTimeout(() => setIsAutoPlaying(true), 8000);
              }}
              className={`transition-all duration-500 rounded-full ${
                index === activeSlide
                  ? 'w-8 md:w-10 h-2 md:h-3 bg-gradient-to-r from-primary to-primary/70'
                  : 'w-2 md:w-3 h-2 md:h-3 bg-muted-foreground/40 hover:bg-muted-foreground/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopTheLook;
