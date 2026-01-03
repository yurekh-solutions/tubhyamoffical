import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const lookbookImages = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    title: "Urban Elegance",
    category: "Formal"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    title: "Street Style",
    category: "Casual"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
    title: "Weekend Vibes",
    category: "Track Pants"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    title: "Power Dressing",
    category: "Formal"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&q=80",
    title: "Denim Dreams",
    category: "Jeans"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    title: "Effortless Chic",
    category: "Casual"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80",
    title: "City Nights",
    category: "Formal"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80",
    title: "Modern Classic",
    category: "Jeans"
  }
];

const Lookbook = () => {
  return (
    <>
      <SEO
        title="Lookbook | Fashion Inspiration"
        description="Explore Tubhyam's lookbook for premium women's fashion inspiration. Discover styling ideas for formal wear, jeans, and casual pants."
        keywords="fashion lookbook, women's style, outfit inspiration, premium fashion, Tubhyam lookbook"
        url="https://tubhyam.com/lookbook"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background z-10" />
          <img
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80"
            alt="Lookbook Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 text-center">
          <p className="text-primary uppercase tracking-widest text-sm mb-4 animate-fade-in">Season 2026</p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            The <span className="text-gradient-gold">Lookbook</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Discover our curated collection of style inspirations
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lookbookImages.map((item, index) => (
              <Link
                key={item.id}
                to="/products"
                className={`group relative overflow-hidden rounded-2xl ${
                  index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`aspect-[3/4] ${index % 5 === 0 ? 'md:aspect-square' : ''}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-primary text-sm uppercase tracking-wider mb-2">{item.category}</p>
                    <h3 className="font-heading text-2xl md:text-3xl text-white font-semibold mb-4">{item.title}</h3>
                    <span className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors">
                      Shop the Look <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-6">
            Ready to <span className="text-gradient-gold">Elevate Your Style?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our complete collection and find your perfect pair
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
          >
            Shop Collection
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Lookbook;
