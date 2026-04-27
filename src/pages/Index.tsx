import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Phone, Truck, Shield, RefreshCw,Award, Heart, Gem , Video, Sparkles, ShoppingBag, ArrowRight, BookOpen, Star } from 'lucide-react';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import TestimonialsSlider from '@/components/TestimonialsSlider';
import InstagramFeed from '@/components/InstagramFeed';
import NewsletterSection from '@/components/NewsletterSection';
// import StyleQuiz from '@/components/StyleQuiz';
import ShopTheLook from '@/components/ShopTheLook';

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Tubhyam | Premium Women's Pants, Jeans & Formal Wear"
        description="Shop premium women's pants at Tubhyam. Explore our collection of jeans, formal trousers, and track pants. Free shipping, sustainable fashion, 7-day returns."
        keywords="women's pants, women's jeans, formal trousers, track pants, Indian fashion, premium clothing, sustainable fashion"
        url="https://tubhyam.com"
      />
      <Navbar />
      <Hero />
      <Categories />
      
      {/* Shop The Look */}
      <ShopTheLook />

        <FeaturedProducts type="bestsellers" />

      {/* Features Bar */}
      <section className="py-12 border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Fast Delivery', description: 'Quick & reliable shipping' },
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

      {/* Video Call CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl glass-card p-12 md:p-20 bg-gradient-to-br from-primary/20 via-background to-primary/10">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <p className="text-primary font-medium mb-4 uppercase tracking-widest text-sm">Personal Styling</p>
              <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-6">
                Shop via <span className="text-gradient-gold">Video Call</span>
              </h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                Get a free virtual styling session with our fashion experts. Receive personalized recommendations tailored to your unique taste.
              </p>
              <Link 
                to="/video-call"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
              >
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
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

      {/* New Arrivals */}
      <FeaturedProducts type="new" />

      {/* Testimonials */}
      <TestimonialsSlider />

      {/* Style Quiz */}
      {/* <StyleQuiz /> */}

      {/* Instagram Feed */}
      {/* <InstagramFeed /> */}

      {/* Newsletter */}
      <NewsletterSection />

      <Footer />
    
 </div>
  );
};

export default Index;
