import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Phone, Truck, Shield, RefreshCw, Video, Sparkles, ShoppingBag } from 'lucide-react';

const WorldOfTubhyam = () => {
  return (
    <div className="min-h-screen">
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
            <h1 className="font-heading text-5xl md:text-7xl font-bold animate-fade-in">
              Premium Women's <span className="text-gradient-gold">Fashion</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Discover elegance and comfort with Tubhyam's exclusive collection
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
                World of Tubhyam
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
          <div className="grid md:grid-cols-3 gap-8">
            {/* Shop Collection */}
            <Link 
              to="/products"
              className="group relative overflow-hidden rounded-2xl glass-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
              <ShoppingBag className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-semibold mb-2">Shop Collection</h3>
              <p className="text-muted-foreground mb-4">
                Explore our premium range of women's pants, designed for comfort and style.
              </p>
              <span className="text-primary font-medium inline-flex items-center gap-2">
                Browse Now →
              </span>
            </Link>

            {/* Video Call Shopping */}
            <Link 
              to="/video-call"
              className="group relative overflow-hidden rounded-2xl glass-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all" />
              <Video className="w-12 h-12 text-accent mb-4" />
              <h3 className="font-heading text-2xl font-semibold mb-2">Video Shopping</h3>
              <p className="text-muted-foreground mb-4">
                Book a free virtual styling session with our fashion experts.
              </p>
              <span className="text-accent font-medium inline-flex items-center gap-2">
                Book Now →
              </span>
            </Link>

            {/* World of Tubhyam */}
            <Link 
              to="/world-of-tubhyam"
              className="group relative overflow-hidden rounded-2xl glass-card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-semibold mb-2">Our Story</h3>
              <p className="text-muted-foreground mb-4">
                Discover the world of Tubhyam, crafted with love and care for you.
              </p>
              <span className="text-primary font-medium inline-flex items-center gap-2">
                Learn More →
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WorldOfTubhyam;
