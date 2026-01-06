import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import formal1 from '@/assets/formals/formal-7.jpeg';
import formal2 from '@/assets/formals/belt-formal-beige.jpeg';
import formal3 from '@/assets/formals/brown-formal.jpeg';
import formal4 from '@/assets/formals/olive-formal-belt.jpeg';
import jeans1 from '@/assets/products/jeans-1.jpg';
import jeans2 from '@/assets/products/jeans-2.jpg';
import track1 from '@/assets/Tracks/cargo.png';
import track2 from '@/assets/Tracks/slimfit.png';

const lookbookImages = [
  {
    id: 1,
    image: formal1,
    title: "Urban Elegance",
    category: "Formal",
    link: "/products?category=formal"
  },
  {
    id: 2,
    image: track1,
    title: "Street Style",
    category: "Track Pants",
    link: "/products?category=track"
  },
  {
    id: 3,
    image: track2,
    title: "Weekend Vibes",
    category: "Track Pants",
    link: "/products?category=track"
  },
  {
    id: 4,
    image: formal2,
    title: "Power Dressing",
    category: "Formal",
    link: "/products?category=formal"
  },
  {
    id: 5,
    image: jeans1,
    title: "Denim Dreams",
    category: "Jeans",
    link: "/products?category=jeans"
  },
  {
    id: 6,
    image: formal3,
    title: "Effortless Chic",
    category: "Formal",
    link: "/products?category=formal"
  },
  {
    id: 7,
    image: formal4,
    title: "City Nights",
    category: "Formal",
    link: "/products?category=formal"
  },
  {
    id: 8,
    image: jeans2,
    title: "Modern Classic",
    category: "Jeans",
    link: "/products?category=jeans"
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
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background z-10" />
          <img
            src={formal1}
            alt="Tubhyam Lookbook - Premium Women's Fashion"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 text-center py-12 sm:py-16">
          <p className="text-primary uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4 animate-fade-in">Season 2026</p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in">
            The <span className="text-gradient-gold">Lookbook</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in px-4">
            Discover our curated collection of style inspirations
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {lookbookImages.map((item, index) => (
              <Link
                key={item.id}
                to={item.link}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl ${
                  index % 5 === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
              >
                <div className={`aspect-[3/4] ${index % 5 === 0 ? 'sm:aspect-square' : ''}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <p className="text-primary text-xs sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">{item.category}</p>
                    <h3 className="font-heading text-xl sm:text-2xl md:text-3xl text-white font-semibold mb-2 sm:mb-4">{item.title}</h3>
                    <span className="inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-white hover:text-primary transition-colors">
                      Shop the Look <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6">
            Ready to <span className="text-gradient-gold">Elevate Your Style?</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Explore our complete collection and find your perfect pair
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-base font-medium hover:shadow-elegant transition-all duration-300 hover:scale-105"
          >
            Shop Collection
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Lookbook;
