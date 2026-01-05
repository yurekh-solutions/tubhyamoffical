import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "Absolutely love the quality! The fabric feels so luxurious.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    location: "Delhi",
    text: "The attention to detail is remarkable. Everything screams premium quality.",
    rating: 4,
  },
  {
    name: "Kavya Desai",
    location: "Bangalore",
    text: "I've ordered multiple times and each pair exceeds my expectations.",
    rating: 5,
  },
  {
    name: "Meera Reddy",
    location: "Hyderabad",
    text: "These pants have become my go-to for both office and casual wear.",
    rating: 4.5,
  },
  {
    name: "Sneha Verma",
    location: "Pune",
    text: "The video call shopping experience was amazing!",
    rating: 3,
  },
  {
    name: "Riya Singh",
    location: "Kolkata",
    text: "Premium quality at its finest. Highly recommend!",
    rating: 5,
  },
  {
    name: "Divya Nair",
    location: "Chennai",
    text: "Best purchase ever! The fit is perfect.",
    rating: 4,
  },
  {
    name: "Pooja Gupta",
    location: "Jaipur",
    text: "Excellent customer service and beautiful products.",
    rating: 4.5,
  },
];

const TestimonialsSlider = () => {
  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/30 via-background to-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-widest text-sm mb-4 font-semibold">Testimonials</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Loved by Our <span className="text-gradient-gold">Premium Customers</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Experience the Tubhyam difference through the words of our satisfied customers
          </p>
        </div>

        <div className="space-y-8">
          {/* Forward Marquee */}
          <div className="relative">
            <div className="flex overflow-hidden">
              <div className="flex animate-marquee-forward">
                {duplicatedTestimonials.map((testimonial, index) => (
                  <div
                    key={`forward-${index}`}
                    className="flex-shrink-0 mx-4"
                  >
                    <div className="glass-card border border-primary/20 rounded-2xl p-6 backdrop-blur-xl bg-background/40 w-80 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                      {/* Star Rating */}
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => {
                          const rating = testimonial.rating;
                          const isFilled = i < Math.floor(rating);
                          const isHalf = i === Math.floor(rating) && rating % 1 !== 0;
                          
                          return (
                            <div key={i} className="relative">
                              {isHalf ? (
                                <>
                                  <Star className="w-4 h-4 text-primary" />
                                  <Star className="w-4 h-4 fill-primary text-primary absolute top-0 left-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                                </>
                              ) : (
                                <Star className={`w-4 h-4 ${isFilled ? 'fill-primary text-primary' : 'text-primary'}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Quote */}
                      <p className="text-sm text-foreground/80 mb-4 italic leading-relaxed">
                        "{testimonial.text}"
                      </p>

                      {/* Customer Info */}
                      <div>
                        <p className="font-heading text-lg font-bold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-primary/70">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reverse Marquee */}
          <div className="relative">
            <div className="flex overflow-hidden">
              <div className="flex animate-marquee-reverse">
                {duplicatedTestimonials.map((testimonial, index) => (
                  <div
                    key={`reverse-${index}`}
                    className="flex-shrink-0 mx-4"
                  >
                    <div className="glass-card border border-primary/20 rounded-2xl p-6 backdrop-blur-xl bg-background/40 w-80 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                      {/* Star Rating */}
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => {
                          const rating = testimonial.rating;
                          const isFilled = i < Math.floor(rating);
                          const isHalf = i === Math.floor(rating) && rating % 1 !== 0;
                          
                          return (
                            <div key={i} className="relative">
                              {isHalf ? (
                                <>
                                  <Star className="w-4 h-4 text-primary" />
                                  <Star className="w-4 h-4 fill-primary text-primary absolute top-0 left-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                                </>
                              ) : (
                                <Star className={`w-4 h-4 ${isFilled ? 'fill-primary text-primary' : 'text-primary'}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Quote */}
                      <p className="text-sm text-foreground/80 mb-4 italic leading-relaxed">
                        "{testimonial.text}"
                      </p>

                      {/* Customer Info */}
                      <div>
                        <p className="font-heading text-lg font-bold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-primary/70">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
