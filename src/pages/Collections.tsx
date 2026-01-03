import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const collections = [
  {
    id: 'formal',
    title: 'Formal Elegance',
    subtitle: 'Power Dressing Redefined',
    description: 'Sophisticated silhouettes for the modern professional. Command any boardroom with our premium formal collection.',
    image: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1200&q=80',
    link: '/products?category=formal',
    badge: 'Best Seller'
  },
  {
    id: 'jeans',
    title: 'Denim Stories',
    subtitle: 'Timeless Comfort',
    description: 'Premium denim crafted for the perfect fit. From classic cuts to contemporary styles.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
    link: '/products?category=jeans',
    badge: 'New Arrivals'
  },
  {
    id: 'track',
    title: 'Active Luxe',
    subtitle: 'Comfort Meets Style',
    description: 'Elevate your casual wardrobe with our premium track pants. Perfect for work-from-home or weekend outings.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80',
    link: '/products?category=track',
    badge: 'Trending'
  },
  {
    id: 'summer',
    title: 'Summer Essentials',
    subtitle: 'Season 2026',
    description: 'Light, breathable fabrics designed for the Indian summer. Stay cool while looking chic.',
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=80',
    link: '/products',
    badge: 'Limited Edition'
  }
];

const Collections = () => {
  return (
    <>
      <SEO
        title="Collections | Seasonal Fashion"
        description="Explore Tubhyam's exclusive collections - Formal Elegance, Denim Stories, Active Luxe, and Summer Essentials. Premium women's fashion for every occasion."
        keywords="fashion collections, women's formal wear, denim collection, track pants, summer fashion, Tubhyam collections"
        url="https://tubhyam.com/collections"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-6">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm">Curated for You</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6">
            Our <span className="text-gradient-gold">Collections</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover thoughtfully curated collections designed for the modern Indian woman
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {collections.map((collection, index) => (
              <div
                key={collection.id}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Image */}
                <div className="flex-1 w-full">
                  <Link
                    to={collection.link}
                    className="group block relative overflow-hidden rounded-3xl"
                  >
                    <div className="aspect-[4/3]">
                      <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {collection.badge && (
                      <div className="absolute top-6 left-6 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                        {collection.badge}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Link>
                </div>

                {/* Content */}
                <div className="flex-1 w-full lg:max-w-lg">
                  <p className="text-primary uppercase tracking-widest text-sm mb-4">{collection.subtitle}</p>
                  <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-6">
                    {collection.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {collection.description}
                  </p>
                  <Link
                    to={collection.link}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
                  >
                    Explore Collection
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-6">
            Stay <span className="text-gradient-gold">Ahead of Trends</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be the first to know when new collections drop. Join our exclusive mailing list.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-card/80 backdrop-blur border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105 whitespace-nowrap">
              Notify Me
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Collections;
