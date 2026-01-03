import { useState, useEffect } from 'react';
import { Quote, Star } from 'lucide-react';

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

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/30 via-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-widest text-sm mb-4 font-semibold">Testimonials</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Loved by Our <span className="text-gradient-gold">Premium Customers</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Experience the Tubhyam difference through the words of our satisfied customers</p>
        </div>

        <div className="flex justify-center items-center">
          {/* Testimonial Card */}
          <div className="w-full max-w-2xl">
            <div className="relative">
              {/* Premium Glass Card with gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl blur-lg opacity-50"></div>
              
              <div className="relative glass-card border border-primary/20 p-8 md:p-12 rounded-2xl backdrop-blur-xl bg-background/40 shadow-2xl">
                {/* Decorative Quote */}
                <div className="absolute top-6 left-6 opacity-10">
                  <Quote className="w-16 h-16 text-primary" />
                </div>

                {/* Star Rating */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-lg md:text-2xl text-foreground font-light leading-relaxed mb-8 text-center italic">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                </div>

                {/* Customer Info */}
                <div className="flex flex-col items-center gap-4">
                  {/* Customer Avatar */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-lg opacity-50"></div>
                    <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/30 border-2 border-primary/20 shadow-lg">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Name and Location */}
                  <div className="text-center">
                    <p className="font-heading text-xl md:text-2xl font-semibold text-foreground">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-primary/70 font-medium">{testimonials[currentIndex].location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dot Navigation */}
            <div className="flex justify-center gap-3 mt-10">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(idx);
                  }}
                  className={`transition-all duration-500 rounded-full ${
                    idx === currentIndex
                      ? 'w-10 h-3 bg-gradient-to-r from-primary to-primary/70 shadow-lg'
                      : 'w-3 h-3 bg-muted-foreground/40 hover:bg-muted-foreground/60'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            {/* Auto-play indicator */}
            <div className="flex justify-center mt-6">
              <p className="text-xs text-muted-foreground">
                {currentIndex + 1} of {testimonials.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
