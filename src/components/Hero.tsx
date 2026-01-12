import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroVideo from '@/assets/video.mp4';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 flex justify-center">
        <div className="max-w-4xl space-y-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 animate-fade-in-up mx-auto">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium">New Collection 2026</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-gradient-gold">Premium</span>
            <br />
            Women's Pants
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discover our exclusive collection of elegant, comfortable, and stylish pants. 
            From formal office wear to casual weekend comfort - crafted for the modern woman.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/products"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-elegant hover:shadow-primary/30 btn-glow"
            >
              Shop Collection
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 glass-card px-8 py-4 rounded-full font-medium hover:border-primary/30 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 pt-8 animate-fade-in-up flex-wrap" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="font-heading text-3xl font-semibold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <p className="font-heading text-3xl font-semibold text-primary">1000+</p>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="text-center">
              <p className="font-heading text-3xl font-semibold text-primary">4.9★</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
    
    </section>
  );
};

export default Hero;
