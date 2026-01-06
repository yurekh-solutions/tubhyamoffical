import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { products } from '@/data/products';

const ShopTheLook = () => {
  const [activeSlide, setActiveSlide] = useState(2); // Start with center item
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get featured products with images for the lookbook
  const lookProducts = products
    .filter(p => p.images.length > 0 && (p.isBestSeller || p.isNew))
    .slice(0, 8);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % lookProducts.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, lookProducts.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setActiveSlide((prev) => (prev - 1 + lookProducts.length) % lookProducts.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveSlide((prev) => (prev + 1) % lookProducts.length);
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
        <div className="relative h-[500px] md:h-[600px]">
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
                      translateX(${position * 280}px)
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
                      isActive ? 'w-72 h-96 md:w-80 md:h-[480px]' : 'w-64 h-80 md:w-72 md:h-96'
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
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="font-heading text-xl font-bold text-white mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-white/80 text-sm mb-4 line-clamp-1">
                            {product.category}
                          </p>
                          <Link
                            to={`/products/${product.id}`}
                            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-4 glass-card border border-primary/20 rounded-full hover:border-primary/50 transition-all duration-300 hover:scale-110 group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-4 glass-card border border-primary/20 rounded-full hover:border-primary/50 transition-all duration-300 hover:scale-110 group"
          >
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-12">
          {lookProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveSlide(index);
              }}
              className={`transition-all duration-500 rounded-full ${
                index === activeSlide
                  ? 'w-10 h-3 bg-gradient-to-r from-primary to-primary/70'
                  : 'w-3 h-3 bg-muted-foreground/40 hover:bg-muted-foreground/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            {isAutoPlaying ? 'Auto-playing' : 'Paused'} • {activeSlide + 1} of {lookProducts.length}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShopTheLook;
