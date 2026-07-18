import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SEO from '@/components/SEO';
import { useWishlist } from '@/context/WishlistContext';
import { useTheme } from '@/context/ThemeContext';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { isLight } = useTheme();

  return (
    <div className={`min-h-screen ${isLight ? 'bg-[#F5F0E8]' : ''}`}>
      <SEO
        title="My Wishlist | Tubhyam"
        description="Your saved fashion picks at Tubhyam. Shop your favourite pants, jeans and track pants."
        url="https://www.tubhyam.in/wishlist"
      />
      <Navbar />

      <section className="container mx-auto px-4 pt-28 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold flex items-center gap-3">
              <Heart size={28} className="text-red-500" fill="currentColor" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {items.length > 0
                ? `${items.length} item${items.length > 1 ? 's' : ''} saved`
                : 'Your wishlist is empty'}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isLight ? 'bg-gray-100' : 'bg-white/5'
            }`}>
              <Heart size={40} className="text-muted-foreground" />
            </div>
            <h2 className="font-heading text-2xl font-semibold mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Browse our collection and tap the heart icon to save your favourite items here.
            </p>
            <Link
              to="/shop"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
                isLight
                  ? 'bg-[#2E241F] text-white hover:bg-[#1A1410]'
                  : 'glass-card bg-white/90 text-[#1A1410] hover:bg-white'
              }`}
            >
              <ShoppingBag size={18} />
              Start Shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((product) => (
              <div key={product.id} className="relative group/card">
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all shadow-lg opacity-0 group-hover/card:opacity-100 ${
                    isLight
                      ? 'bg-white text-red-500 hover:bg-red-50'
                      : 'bg-black/60 backdrop-blur text-red-400 hover:bg-black/80'
                  }`}
                >
                  <Heart size={16} fill="currentColor" />
                </button>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Wishlist;
