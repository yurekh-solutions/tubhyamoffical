import { useState, useEffect } from 'react';
import { Quote, Star, TrendingUp } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "Absolutely love the quality! The fabric feels so luxurious against the skin. Finally found pants that fit perfectly and look elegant.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    product: "Premium Silk Pants",
    verified: true
  },
  {
    name: "Ananya Patel",
    location: "Delhi",
    text: "The attention to detail is remarkable. From the stitching to the fabric, everything screams premium quality. Worth every penny!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    product: "Formal Wear Collection",
    verified: true
  },
  {
    name: "Kavya Desai",
    location: "Bangalore",
    text: "I've ordered multiple times and each pair exceeds my expectations. The customer service is exceptional too. Highly recommend!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    product: "Casual Denim Series",
    verified: true
  },
  {
    name: "Meera Reddy",
    location: "Hyderabad",
    text: "These pants have become my go-to for both office and casual wear. The comfort and style combination is unmatched.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    product: "Office Pro Trousers",
    verified: true
  },
  {
    name: "Sneha Verma",
    location: "Pune",
    text: "The video call shopping experience was amazing! Got personalized styling advice and found the perfect pieces for my wardrobe.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
    product: "Personalized Styling",
    verified: true
  }
];

const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/30 via-background to-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-widest text-sm mb-4 font-semibold flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Testimonials
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Loved by Our <span className="text-gradient-gold">Premium Customers</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Experience the Tubhyam difference through the words of our satisfied customers</p>
        </div>

        <div 
          className="flex justify-center items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Testimonial Card */}
          <div className="w-full max-w-3xl">
            <div className="relative">
              {/* Premium Glass Card with gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>
              
              <div className="relative glass-card border border-primary/40 p-8 md:p-16 rounded-3xl backdrop-blur-2xl bg-background/50 shadow-2xl transform transition-all duration-500 hover:shadow-3xl">
                {/* Decorative Quote - Large */}
                <div className="absolute -top-8 left-6 opacity-20 pointer-events-none">
                  <Quote className="w-24 h-24 text-primary" />
                </div>

                {/* Badge */}
                <div className="flex justify-center mb-6">
                  {testimonials[currentIndex].verified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>

                {/* Dynamic Star Rating with animation */}
                <div className="flex justify-center gap-2 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="transform transition-all duration-500"
                      style={{
                        transitionDelay: `${i * 100}ms`
                      }}
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          i < testimonials[currentIndex].rating
                            ? 'fill-primary text-primary animate-bounce'
                            : 'fill-muted-foreground/30 text-muted-foreground/30'
                        }`}
                        style={{
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Product Badge */}
                <div className="text-center mb-6">
                  <span className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 text-sm font-medium text-primary">
                    {testimonials[currentIndex].product}
                  </span>
                </div>

                {/* Quote Text with fade animation */}
                <p className="text-lg md:text-xl text-foreground font-light leading-relaxed mb-8 text-center italic animate-fade-in">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Gradient Divider */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                </div>

                {/* Customer Info with enhanced styling */}
                <div className="flex flex-col items-center gap-5">
                  {/* Customer Avatar with glow */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/50 to-transparent rounded-full blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/40 border-4 border-primary/30 shadow-2xl transform transition-transform duration-300 hover:scale-110">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Name and Location */}
                  <div className="text-center">
                    <p className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-primary/80 font-semibold mt-1">{testimonials[currentIndex].location}</p>
                  </div>

                  {/* Rating Text */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Rating: <span className="font-semibold text-primary">{testimonials[currentIndex].rating}/5</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-center items-center gap-6 mt-12">
              <button
                onClick={handlePrev}
                className="group relative p-3 rounded-full border-2 border-primary/40 hover:border-primary transition-all duration-300 bg-background/50 backdrop-blur hover:bg-primary/10"
                aria-label="Previous testimonial"
              >
                <span className="text-primary text-xl transition-transform group-hover:-translate-x-1">‹</span>
              </button>

              {/* Dot Navigation with enhanced styling */}
              <div className="flex justify-center gap-3 px-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(idx);
                    }}
                    className={`transition-all duration-500 rounded-full group relative ${
                      idx === currentIndex
                        ? 'w-10 h-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 shadow-lg shadow-primary/50'
                        : 'w-3 h-3 bg-muted-foreground/40 hover:bg-primary/60 hover:scale-125'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  >
                    {idx === currentIndex && (
                      <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></span>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="group relative p-3 rounded-full border-2 border-primary/40 hover:border-primary transition-all duration-300 bg-background/50 backdrop-blur hover:bg-primary/10"
                aria-label="Next testimonial"
              >
                <span className="text-primary text-xl transition-transform group-hover:translate-x-1">›</span>
              </button>
            </div>

            {/* Auto-play indicator with animation */}
            <div className="flex justify-center mt-8 gap-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{currentIndex + 1}</span>
                <span className="mx-1">/</span>
                <span>{testimonials.length}</span>
              </p>
              {isAutoPlaying && !isHovered && (
                <span className="text-xs text-primary/70 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Auto-playing
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
