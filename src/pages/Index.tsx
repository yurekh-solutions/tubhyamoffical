import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Phone, Truck, Shield, RefreshCw, Award, Heart, Gem, Video, TrendingUp, Users, Package, Clock } from 'lucide-react';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import TestimonialsSlider from '@/components/TestimonialsSlider';
import InstagramFeed from '@/components/InstagramFeed';
import NewsletterSection from '@/components/NewsletterSection';
import StyleQuiz from '@/components/StyleQuiz';

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
      
      {/* Hero */}
      <Hero />
      
      {/* Categories */}
      <Categories />

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Users, number: '10K+', label: 'Happy Customers' },
              { icon: Package, number: '50+', label: 'Premium Products' },
              { icon: TrendingUp, number: '98%', label: 'Satisfaction Rate' },
              { icon: Clock, number: '24/7', label: 'Customer Support' },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <stat.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-heading text-3xl font-bold text-primary mb-1">{stat.number}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <p className="text-primary uppercase tracking-widest text-sm mb-4 font-semibold">Why Choose Us</p>
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-4">
              The <span className="text-gradient-gold">Tubhyam Promise</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience luxury fashion with uncompromising quality and personalized service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { 
                icon: Gem, 
                title: 'Premium Quality', 
                description: 'Handpicked fabrics for ultimate comfort',
                gradient: 'from-amber-500/20 to-orange-500/20',
                iconColor: 'text-amber-500'
              },
              { 
                icon: Heart, 
                title: 'Made with Love', 
                description: 'Crafted with attention to every detail',
                gradient: 'from-pink-500/20 to-rose-500/20',
                iconColor: 'text-rose-500'
              },
              { 
                icon: Award, 
                title: 'Best in Class', 
                description: 'Trusted by thousands of customers',
                gradient: 'from-blue-500/20 to-cyan-500/20',
                iconColor: 'text-blue-500'
              },
              { 
                icon: Video, 
                title: 'Personal Styling', 
                description: 'Free video call consultations',
                gradient: 'from-purple-500/20 to-indigo-500/20',
                iconColor: 'text-purple-500'
              },
            ].map((value, index) => (
              <div 
                key={index} 
                className="group relative"
              >
                <div className={`relative glass-card border border-primary/20 rounded-3xl p-8 h-full backdrop-blur-xl hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${value.gradient}`}>
                  <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <value.icon size={32} className={value.iconColor} />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts type="bestsellers" />

      {/* Video Call CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[2rem] glass-card border border-primary/20 p-12 md:p-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 backdrop-blur-xl">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center backdrop-blur-xl">
                <Video size={40} className="text-primary" />
              </div>
              <p className="text-primary font-bold mb-4 uppercase tracking-widest text-sm">Personal Styling</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Shop via <span className="text-gradient-gold">Video Call</span>
              </h2>
              <p className="text-muted-foreground mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
                Get a free virtual styling session with our fashion experts. Receive personalized recommendations tailored to your unique taste and style.
              </p>
              <Link 
                to="/video-call"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                <Video size={24} />
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-16 border-y border-border bg-gradient-to-r from-secondary/20 via-secondary/30 to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Truck, title: 'Fast Delivery', description: 'Quick & reliable shipping', gradient: 'from-blue-500/20 to-cyan-500/20' },
              { icon: Shield, title: 'Secure Payment', description: '100% secure checkout', gradient: 'from-green-500/20 to-emerald-500/20' },
              { icon: RefreshCw, title: 'Easy Returns', description: '7 days return policy', gradient: 'from-orange-500/20 to-amber-500/20' },
              { icon: Phone, title: 'WhatsApp Support', description: '24/7 customer service', gradient: 'from-purple-500/20 to-pink-500/20' },
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className={`glass-card border border-primary/20 rounded-2xl p-6 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 hover:scale-105 bg-gradient-to-br ${feature.gradient}`}>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-background/60 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon size={28} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="glass-card border border-primary/20 rounded-[2rem] p-12 md:p-16 backdrop-blur-xl text-center space-y-8 bg-gradient-to-br from-background/50 to-background/30">
              <p className="text-primary uppercase tracking-widest text-sm font-bold">Our Story</p>
              <h2 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
                Crafted with <span className="text-gradient-gold">Love & Care</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                At Tubhyam (तुम्हारे लिए - "For You"), we believe every woman deserves clothing that 
                makes her feel confident and comfortable. Our collection of premium pants is designed 
                with meticulous attention to detail, using only the finest fabrics and craftsmanship. 
                From the boardroom to weekend brunches, we've got the perfect pair for every moment of your life.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <Link 
                  to="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-10 py-4 rounded-full font-bold hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                >
                  Explore Collection
                </Link>
                <Link 
                  to="/discover-our-world"
                  className="inline-flex items-center gap-2 glass-card border border-primary/30 px-10 py-4 rounded-full font-bold hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  Discover Our World
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <FeaturedProducts type="new" />

      {/* Testimonials */}
      <TestimonialsSlider />

      {/* Style Quiz */}
      <StyleQuiz />

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Newsletter */}
      <NewsletterSection />

      <Footer />
    </div>
  );
};

export default Index;
