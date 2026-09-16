import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { products } from '@/data/products';
import { useTheme } from '@/context/ThemeContext';

const formal1 = '/images/products/formal-7.jpg';

const Lookbook = () => {
  const { isLight } = useTheme();
  const [images, setImages] = useState<{ id: string; image: string; url: string; name: string }[]>([]);

  useEffect(() => {
    const all: { id: string; image: string; url: string; name: string }[] = [];
    products.forEach(p => {
      const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
      imgs.forEach((img, i) => {
        const lower = img.toLowerCase();
        // Skip back views, shoes, close-ups - only front/pose shots
        if (lower.includes('back') || lower.includes('shoe') || lower.includes('sole')) return;
        all.push({ id: `${p.id}-${i}`, image: img, url: `/product/${p.id}`, name: p.name || '' });
      });
    });
    setImages(all.sort(() => 0.5 - Math.random()).slice(0, 9));
  }, []);

  return (
    <>
      <SEO
        title="Lookbook | Tubhyam - Fashion Inspiration & Styling Ideas"
        description="Explore Tubhyam's lookbook for premium women's fashion inspiration. Discover styling ideas for formal trousers, wide-leg pants, baggy pleated pants, jeans, cargo pants, and casual wear."
        url="https://www.tubhyam.in/lookbook"
        breadcrumbItems={[{ name: 'Lookbook', url: 'https://www.tubhyam.in/lookbook' }]}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 z-10 ${isLight ? 'bg-gradient-to-b from-black/60 via-black/35 to-black/70' : 'bg-gradient-to-b from-background/90 via-background/70 to-background'}`} />
          <img src={formal1} alt="Tubhyam Lookbook" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-20 container mx-auto px-4 text-center py-12 sm:py-16">
          <p className={`uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4 ${isLight ? 'text-[#E8B882]' : 'text-primary'}`}>Season 2026</p>
          <h1 className={`font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 ${isLight ? 'text-white' : ''}`}>
            The <span className="text-gradient-gold">Lookbook</span>
          </h1>
          <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 ${isLight ? 'text-white/85' : 'text-muted-foreground'}`}>
            Discover our curated collection of style inspirations
          </p>
        </div>
      </section>

      {/* Gallery - Editorial Layout */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Row 1: Large + Two stacked */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Link to={images[0]?.url} className="group relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-auto md:h-[520px]">
              <img src={images[0]?.image} alt={images[0]?.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white text-base font-medium">{images[0]?.name}</p>
                  <span className="text-white/70 text-xs flex items-center gap-1 mt-1">Shop Now <ArrowRight size={11} /></span>
                </div>
              </div>
            </Link>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Link to={images[1]?.url} className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <img src={images[1]?.image} alt={images[1]?.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs font-medium line-clamp-2">{images[1]?.name}</p>
                  </div>
                </div>
              </Link>
              <Link to={images[2]?.url} className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <img src={images[2]?.image} alt={images[2]?.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs font-medium line-clamp-2">{images[2]?.name}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Row 2: Two stacked + Large */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Link to={images[3]?.url} className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <img src={images[3]?.image} alt={images[3]?.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs font-medium line-clamp-2">{images[3]?.name}</p>
                  </div>
                </div>
              </Link>
              <Link to={images[4]?.url} className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <img src={images[4]?.image} alt={images[4]?.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs font-medium line-clamp-2">{images[4]?.name}</p>
                  </div>
                </div>
              </Link>
            </div>
            <Link to={images[5]?.url} className="group relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-auto md:h-[520px]">
              <img src={images[5]?.image} alt={images[5]?.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white text-base font-medium">{images[5]?.name}</p>
                  <span className="text-white/70 text-xs flex items-center gap-1 mt-1">Shop Now <ArrowRight size={11} /></span>
                </div>
              </div>
            </Link>
          </div>

          {/* Row 3: Three equal */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[6, 7, 8].map((i) => (
              <Link key={images[i]?.id} to={images[i]?.url} className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <img src={images[i]?.image} alt={images[i]?.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs font-medium line-clamp-2">{images[i]?.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-105 transition-all">
              <ShoppingBag size={16} />
              Shop Collection
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Lookbook;
