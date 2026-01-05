import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "Absolutely love the quality! The fabric feels so luxurious.",
  },
  {
    name: "Ananya Patel",
    location: "Delhi",
    text: "The attention to detail is remarkable. Everything screams premium quality.",
  },
  {
    name: "Kavya Desai",
    location: "Bangalore",
    text: "I've ordered multiple times and each pair exceeds my expectations.",
  },
  {
    name: "Meera Reddy",
    location: "Hyderabad",
    text: "These pants have become my go-to for both office and casual wear.",
  },
  {
    name: "Sneha Verma",
    location: "Pune",
    text: "The video call shopping experience was amazing!",
  },
  {
    name: "Riya Singh",
    location: "Kolkata",
    text: "Premium quality at its finest. Highly recommend!",
  },
  {
    name: "Divya Nair",
    location: "Chennai",
    text: "Best purchase ever! The fit is perfect.",
  },
  {
    name: "Pooja Gupta",
    location: "Jaipur",
    text: "Excellent customer service and beautiful products.",
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
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
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
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
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
