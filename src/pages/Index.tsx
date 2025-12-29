import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import { Link } from 'react-router-dom';
import { Phone, Truck, Shield, RefreshCw, Star, Users, Award, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Priya Singh",
      rating: 5,
      text: "Finally found pants that fit perfectly! The quality is amazing and delivery was super fast. Highly recommend!",
      location: "Delhi"
    },
    {
      name: "Ananya Patel",
      rating: 4,
      text: "The comfort and style combined is unbeatable. I've ordered 3 times now and each time the experience was excellent.",
      location: "Mumbai"
    },
    {
      name: "Neha Sharma",
      rating: 3,
      text: "Good quality pants at reasonable prices. Size guide was helpful and customer service was responsive.",
      location: "Bangalore"
    },
    {
      name: "Kavya Desai",
      rating: 5,
      text: "Best purchase ever! The size guide was so helpful and customer service is incredibly responsive. Worth every rupee!",
      location: "Pune"
    },
    {
      name: "Meera Verma",
      rating: 4,
      text: "Premium fabric quality with affordable pricing. Loved the fitting and the fast delivery service. Will buy again!",
      location: "Hyderabad"
    },
    {
      name: "Sneha Reddy",
      rating: 5,
      text: "Absolutely stunning collection! Every pair is worth the investment. The craftsmanship is exceptional and customer support is top-notch.",
      location: "Chennai"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 2) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 2 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    return [
      testimonials[currentIndex],
      testimonials[(currentIndex + 1) % testimonials.length]
    ];
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Features Bar */}
      <section className="py-8 border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹2000' },
              { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
              { icon: RefreshCw, title: 'Easy Returns', description: '7 days return policy' },
              { icon: Phone, title: 'WhatsApp Support', description: '24/7 customer service' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="p-3 glass-card rounded-xl">
                  <feature.icon size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <Categories />

      {/* Best Sellers */}
      <FeaturedProducts type="bestsellers" />

      {/* Promotional Banner */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl glass-card p-12 md:p-20">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <p className="text-primary font-medium mb-4 uppercase tracking-widest text-sm">Special Offer</p>
              <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-6">
                Get <span className="text-gradient-gold">20% Off</span> On Your First Order
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Join thousands of happy customers who trust Tubhyam for their premium fashion needs. 
                Use code FIRST20 at checkout.
              </p>
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:shadow-elegant transition-all duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <FeaturedProducts type="new" />

      {/* Testimonial / Brand Story */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-primary uppercase tracking-widest text-sm">Our Story</p>
            <h2 className="font-heading text-4xl md:text-5xl font-semibold">
              Crafted with <span className="text-gradient-gold">Love & Care</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Tubhyam (तुम्हारे लिए - "For You"), we believe every woman deserves clothing that 
              makes her feel confident and comfortable. Our collection of premium pants is designed 
              with meticulous attention to detail, using only the finest fabrics and craftsmanship. 
              From the boardroom to weekend brunches, we've got the perfect pair for every moment of your life.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:shadow-elegant transition-all duration-300"
              >
                Explore Collection
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 glass-card px-8 py-4 rounded-full font-medium hover:border-primary/30 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <p className="text-primary uppercase tracking-widest text-sm mb-4">Premium Brand Love</p>
                <h2 className="font-heading text-4xl md:text-5xl font-semibold">
                  Loved by <span className="text-gradient-gold">Customers</span>
                </h2>
              </div>

              <div className="max-w-5xl mx-auto">
                {/* Carousel Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {getVisibleTestimonials().map((testimonial, index) => (
                    <motion.div
                      key={`${currentIndex}-${index}`}
                      initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: index === 0 ? 50 : -50 }}
                      transition={{ duration: 0.5 }}
                      className="glass-card p-6 border border-primary/20 rounded-xl"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-1">
                          {Array(testimonial.rating).fill(0).map((_, i) => (
                            <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                          ))}
                          {Array(5 - testimonial.rating).fill(0).map((_, i) => (
                            <Star key={`empty-${i}`} size={18} className="text-gray-300" />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-primary">{testimonial.rating}.0</span>
                      </div>
                      <p className="text-foreground/80 mb-4 italic">"{testimonial.text}"</p>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-foreground/60">{testimonial.location}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-center gap-4 items-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevSlide}
                    className="p-3 glass-card border border-primary/30 rounded-full hover:border-primary/60 transition-colors"
                  >
                    <ChevronLeft size={24} className="text-primary" />
                  </motion.button>

                  {/* Dots Indicator */}
                  <div className="flex gap-2">
                    {Array(Math.ceil(testimonials.length / 2)).fill(0).map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setCurrentIndex((i * 2) % testimonials.length)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === Math.floor(currentIndex / 2)
                            ? 'bg-primary w-6'
                            : 'bg-primary/30 hover:bg-primary/60'
                        }`}
                      />
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextSlide}
                    className="p-3 glass-card border border-primary/30 rounded-full hover:border-primary/60 transition-colors"
                  >
                    <ChevronRight size={24} className="text-primary" />
                  </motion.button>
                </div>
              </div>
            </div>
          </section>

      {/* Trust & Stats Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Users, number: '12.5K+', label: 'Happy Customers' },
              { icon: Award, number: '248+', label: 'Products' },
              { icon: Check, number: '100%', label: 'Authentic' },
              { icon: Truck, number: '2-3 Days', label: 'Fast Shipping' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                  <stat.icon size={32} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-foreground/70 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
