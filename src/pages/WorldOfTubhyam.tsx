import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import TestimonialsSlider from '@/components/TestimonialsSlider';
import NewsletterSection from '@/components/NewsletterSection';
import InstagramFeed from '@/components/InstagramFeed';
import SEO from '@/components/SEO';
import {  Phone, Truck, Shield, RefreshCw,Award, Heart, Gem , Video, Sparkles, ShoppingBag, ArrowRight, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorldOfTubhyam = () => {
  return (
    <>
      <SEO
        title="World of Tubhyam | Premium Women's Fashion Experience"
        description="Experience the world of Tubhyam - India's premium women's fashion brand. Discover elegant pants, jeans, and formal wear crafted with love."
        keywords="premium fashion, women's pants, luxury clothing, Indian fashion brand, Tubhyam, elegant wear"
        url="https://tubhyam.com/world-of-tubhyam"
      />
      <Navbar />
           {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-10" />
          <img 
            src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80"
            alt="Fashion Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4">
              <Star size={16} className="text-primary" />
              <span className="text-sm">Premium Quality Since 2024</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold animate-fade-in">
              Premium Women's <span className="text-gradient-gold">Fashion</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Discover elegance and comfort with Tubhyam's exclusive collection of pants, jeans, and formal wear
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag size={20} />
                Shop Now
              </Link>
              <Link 
                to="/world-of-tubhyam"
                className="inline-flex items-center gap-2 glass-card px-8 py-4 rounded-full font-medium hover:border-primary/30 transition-all duration-300 hover:scale-105"
              >
                <Sparkles size={20} />
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </section>

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

      {/* Quick Links Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-widest text-sm mb-4">Explore</p>
            <h2 className="font-heading text-4xl md:text-5xl font-semibold">
              Discover <span className="text-gradient-gold">Tubhyam</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Shop Collection */}
            <Link 
              to="/products"
              className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
              <ShoppingBag className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Shop Collection</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Premium pants for every occasion
              </p>
              <span className="text-primary font-medium text-sm inline-flex items-center gap-2">
                Browse <ArrowRight size={14} />
              </span>
            </Link>

            {/* Video Call Shopping */}
            <Link 
              to="/video-call"
              className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all" />
              <Video className="w-10 h-10 text-accent mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Video Shopping</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Free virtual styling session
              </p>
              <span className="text-accent font-medium text-sm inline-flex items-center gap-2">
                Book <ArrowRight size={14} />
              </span>
            </Link>

            {/* Lookbook */}
            <Link 
              to="/lookbook"
              className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
              <BookOpen className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Lookbook</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Fashion inspiration gallery
              </p>
              <span className="text-primary font-medium text-sm inline-flex items-center gap-2">
                View <ArrowRight size={14} />
              </span>
            </Link>

            {/* Collections */}
            <Link 
              to="/collections"
              className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
              <Sparkles className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Collections</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Seasonal curated styles
              </p>
              <span className="text-primary font-medium text-sm inline-flex items-center gap-2">
                Explore <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
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
            </p>
            <Link 
              to="/discover-our-world"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
            >
              Discover Our World
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
   
    </>
  );
};

export default WorldOfTubhyam;
