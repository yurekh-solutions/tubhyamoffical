import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Phone, Truck, Shield, RefreshCw,Award, Heart, Gem , Video, Sparkles, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import TestimonialsSlider from '@/components/TestimonialsSlider';
import InstagramFeed from '@/components/InstagramFeed';
import NewsletterSection from '@/components/NewsletterSection';
import TrustBadges from '@/components/TrustBadges';
import SaleBanner from '@/components/SaleBanner';
import EmailPopup from '@/components/EmailPopup';
import ShopTheLook from '@/components/ShopTheLook';

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Tubhyam | Premium Women's Pants, Jeans & Formal Wear | Shop Online India"
        description="Shop premium women's pants at Tubhyam.in — India's destination for formal trousers, wide-leg pants, baggy pleated pants, belt formal pants, cargo pants, track pants, cord sets, lace pants, Korean baggy pants, and classic denim jeans. Free shipping on orders ₹2000+. 15-day easy returns."
        keywords="tubhyam, tubhyam.in, women's pants, women's jeans, formal trousers, wide leg pants, baggy pleated pants, belt formal pants, cargo pants, track pants, cord set co-ord, lace pants, korean baggy pants, premium women's clothing, Indian fashion, sustainable fashion, online shopping India, buy formal pants online, women's fashion store, office wear women, best formal pants India, affordable premium fashion, designer pants women"
        url="https://www.tubhyam.in"
      />
      <Navbar />
      <Hero />
      <Categories />
      
      {/* Sale Banner */}
      <SaleBanner />

      {/* Shop The Look */}
      <ShopTheLook />

        <FeaturedProducts type="bestsellers" />

      {/* Video Call CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-12 md:p-20 bg-gradient-to-br from-primary/20 via-background to-primary/10">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <p className="text-primary font-medium mb-4 uppercase tracking-widest text-sm">Personal Styling</p>
              <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-6">
                Shop via <span className="text-gradient-gold">Video Call</span>
              </h2>
              <p className="text-muted-foreground mb-8 text-base sm:text-lg max-w-2xl mx-auto">
                Get a free virtual styling session with our fashion experts. Receive personalized recommendations tailored to your unique taste.
              </p>
              <Link 
                to="/video-call"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-medium text-sm sm:text-base whitespace-nowrap hover:shadow-elegant transition-all duration-300 hover:scale-105"
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
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link 
                to="/shop"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:shadow-elegant transition-all duration-300"
              >
                Explore Collection
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto glass-card px-8 py-4 rounded-full font-medium hover:border-primary/30 transition-all duration-300"
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

      {/* Email Capture */}
      <EmailPopup />

      <Footer />
    
 </div>
  );
};

export default Index;
