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
import TrustBadges from '@/components/TrustBadges';
import SaleBanner from '@/components/SaleBanner';
import EmailPopup from '@/components/EmailPopup';
import ShopTheLook from '@/components/ShopTheLook';
import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

const AINOS_RSS_URL = 'https://ainos-ywu0.onrender.com/api/blog-rss';

const Index = () => {
  const { isLight } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(AINOS_RSS_URL);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const items = xml.querySelectorAll('item');
        
        const blogData = Array.from(items).slice(0, 6).map(item => ({
          title: item.querySelector('title')?.textContent?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          description: item.querySelector('description')?.textContent?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '',
          categories: Array.from(item.querySelectorAll('category')).map(c => c.textContent).slice(0, 3),
        }));
        
        setBlogs(blogData);
      } catch (error) {
        console.error('Failed to fetch AINOS blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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

      {/* AINOS Blog Section */}
      <section style={{ borderTop: isLight ? '1px solid rgba(46,26,14,0.06)' : '1px solid rgba(255,211,172,0.06)', padding: '36px 0' }}>
        <div className="container mx-auto px-4">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: isLight ? '#2E1A0E' : '#F0E6DA', marginBottom: 6 }}>
              Powered by AINOS AI Blog Agent
            </h2>
            <p style={{ color: isLight ? '#4A3228' : '#8A7D70', fontSize: 13 }}>
              AI-generated fashion articles from AINOS
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, idx) => {
                return (
                  <a 
                    key={idx} 
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl overflow-hidden glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary/30" />
                    </div>
                    <div className="p-5">
                      {blog.categories && blog.categories.length > 0 && (
                        <span className="inline-block text-xs font-medium text-primary mb-2 uppercase tracking-wide">
                          {blog.categories[0]}
                        </span>
                      )}
                      <h3 className="font-heading text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      {blog.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {blog.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {blog.pubDate && (
                          <span>{new Date(blog.pubDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No blog articles available yet.</p>
            </div>
          )}
        </div>
      </section>

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
