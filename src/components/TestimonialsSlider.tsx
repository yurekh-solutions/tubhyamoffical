import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "Absolutely love the quality! The fabric feels so luxurious against the skin. Finally found pants that fit perfectly and look elegant.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Ananya Patel",
    location: "Delhi",
    text: "The attention to detail is remarkable. From the stitching to the fabric, everything screams premium quality. Worth every penny!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Kavya Desai",
    location: "Bangalore",
    text: "I've ordered multiple times and each pair exceeds my expectations. The customer service is exceptional too. Highly recommend!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Meera Reddy",
    location: "Hyderabad",
    text: "These pants have become my go-to for both office and casual wear. The comfort and style combination is unmatched.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Sneha Verma",
    location: "Pune",
    text: "The video call shopping experience was amazing! Got personalized styling advice and found the perfect pieces for my wardrobe.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary uppercase tracking-widest text-sm mb-4">Testimonials</p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold">
            What Our <span className="text-gradient-gold">Customers Say</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
            <Quote className="absolute top-4 left-4 w-12 h-12 text-primary/20" />
            
            <div className="relative z-10">
              {/* Customer Image */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary/30">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quote */}
              <p className="text-lg md:text-xl text-foreground/90 mb-6 italic leading-relaxed">
                "{testimonials[currentIndex].text}"
              </p>

              {/* Customer Info */}
              <div>
                <p className="font-heading text-xl font-semibold">{testimonials[currentIndex].name}</p>
                <p className="text-muted-foreground">{testimonials[currentIndex].location}</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 glass-card rounded-full hover:bg-primary/20 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 glass-card rounded-full hover:bg-primary/20 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
