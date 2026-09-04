import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AIVirtualTryOn from '@/components/AIVirtualTryOn';
import { products } from '@/data/products';
import { useTheme } from '@/context/ThemeContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  Sparkles, Heart, Star, Search, ShoppingBag, X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Theme tokens                                                       */
/* ------------------------------------------------------------------ */
const useTokens = (isLight: boolean) => ({
  bg:        isLight ? '#FAF5EF' : '#1A1410',
  surface:   isLight ? '#FFFFFF' : '#241E18',
  border:    isLight ? '#E8DDD0' : 'rgba(255,211,172,0.1)',
  text:      isLight ? '#2E241F' : '#FFD3AC',
  textSec:   isLight ? '#6B5E52' : 'rgba(255,211,172,0.6)',
  textMuted: isLight ? '#9B8E82' : 'rgba(255,211,172,0.3)',
  accent:    '#8B5E3C',
  gradient:  'linear-gradient(135deg, #8B5E3C 0%, #A0714D 50%, #C9A882 100%)',
});

/* ------------------------------------------------------------------ */
/*  Store products from real catalog                                   */
/* ------------------------------------------------------------------ */
const STORE_PRODUCTS = products
  .filter(p => p.price > 1)
  .map(p => {
    const seed = p.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return {
      id: p.id,
      name: p.name,
      price: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.price),
      img: p.image,
      rating: +(4 + (seed % 10) / 10).toFixed(1),
      category: p.category,
      original: p.originalPrice,
      isNew: p.isNew,
      isBestSeller: p.isBestSeller,
    };
  });

type Category = 'all' | 'formal' | 'jeans' | 'track';
const TABS: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'formal', label: 'Formal' },
  { key: 'jeans', label: 'Jeans' },
  { key: 'track', label: 'Track' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const Store = () => {
  const { isLight } = useTheme();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const T = useTokens(isLight);

  const [activeTab, setActiveTab] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(STORE_PRODUCTS[0]);
  const [tryOnModal, setTryOnModal] = useState(false);

  const filtered = useMemo(() => {
    let list = STORE_PRODUCTS;
    if (activeTab !== 'all') list = list.filter(p => p.category === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, search]);

  const openTryOn = (product: typeof STORE_PRODUCTS[0]) => {
    setSelectedProduct(product);
    setTryOnModal(true);
  };

  return (
    <>
      <SEO
        title="Store | Tubhyam — Shop Premium Pants Online"
        description="Browse Tubhyam's full collection of premium women's pants — formal trousers, denim jeans, track pants & more. AI Virtual Try-On available on every product."
        keywords="tubhyam store, shop pants online, formal pants store, jeans store, track pants, virtual try on, women's pants India"
        url="https://www.tubhyam.in/store"
        breadcrumbItems={[{ name: 'Store', url: 'https://www.tubhyam.in/store' }]}
      />

      <Navbar />

      <div className="min-h-screen" style={{ background: T.bg }}>
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">

          {/* ─ Top Bar ────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: T.gradient }}>
                <Sparkles size={15} className="text-white" />
              </div>
              <span className="font-heading text-sm font-bold tracking-wider" style={{ color: T.text }}>STORE</span>
            </div>

            {/* Category Tabs */}
            <div className="hidden sm:flex items-center gap-1">
              {TABS.map(tab => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
                    style={{
                      background: active ? (isLight ? '#2E241F' : '#FFD3AC') : 'transparent',
                      color: active ? (isLight ? '#FFFFFF' : '#1A1410') : T.textMuted,
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} style={{ color: T.textMuted }} />
              </div>
              <Link to="/cart" className="relative">
                <ShoppingBag size={16} style={{ color: T.textMuted }} />
              </Link>
            </div>
          </div>

          {/* Mobile tabs */}
          <div className="flex sm:hidden items-center gap-1 mb-6 overflow-x-auto pb-1">
            {TABS.map(tab => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300"
                  style={{
                    background: active ? (isLight ? '#2E241F' : '#FFD3AC') : 'transparent',
                    color: active ? (isLight ? '#FFFFFF' : '#1A1410') : T.textMuted,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg font-bold" style={{ color: T.text }}>
              {activeTab === 'all' ? 'New Arrivals' : `${TABS.find(t => t.key === activeTab)?.label} Collection`}
            </h2>
            <span className="text-xs" style={{ color: T.textMuted }}>{filtered.length} items</span>
          </div>

          {/* ── Search (mobile) ────────────────────────────────── */}
          <div className="sm:hidden relative mb-5">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.textMuted }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-2.5 rounded-full text-xs outline-none"
              style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={12} style={{ color: T.textMuted }} />
              </button>
            )}
          </div>

          {/* ── Product Grid (Full Width) ──────────────────────── */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: T.textMuted }}>No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {filtered.map(product => {
                const discount = product.original
                  ? Math.round((1 - Number(product.price.replace(/[₹,]/g, '')) / product.original) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="group relative rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-1"
                    style={{ background: T.surface, borderColor: T.border }}
                  >
                    {/* Image */}
                    <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Rating badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                        <Star size={8} className="fill-amber-400 text-amber-400" />
                        {product.rating}
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                        {discount > 0 && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: isLight ? '#E8652B' : '#8B5E3C', color: '#fff' }}>
                            {discount}% OFF
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: isLight ? '#8B5E3C' : '#5C3D2E', color: isLight ? '#fff' : '#FFD3AC' }}>
                            Bestseller
                          </span>
                        )}
                        {product.isNew && !product.isBestSeller && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: isLight ? '#2E1A0E' : '#3B2A1A', color: '#fff' }}>
                            New
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Wishlist */}
                    <button
                      onClick={e => { e.preventDefault(); toggleWishlist(product as never); }}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                      style={{
                        background: isInWishlist(product.id) ? '#EF4444' : 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      <Heart size={12} className="text-white" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                    </button>

                    {/* Info */}
                    <div className="p-3 md:p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-xs md:text-sm font-semibold line-clamp-1 mb-1.5 transition-colors" style={{ color: T.text }}>
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-bold" style={{ color: T.text }}>{product.price}</span>
                        {product.original && (
                          <span className="text-[11px] line-through" style={{ color: T.textMuted }}>
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.original)}
                          </span>
                        )}
                      </div>

                      {/* Try-On Button */}
                      <button
                        onClick={() => openTryOn(product)}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          background: isLight ? 'linear-gradient(135deg, #8B5E3C, #A0714D)' : 'linear-gradient(135deg, #3B2A1A, #5C3D2E)',
                          color: isLight ? '#FFFFFF' : '#FFD3AC',
                        }}
                      >
                        <Sparkles size={12} />
                        Try On
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─ Try-On Modal (only on button click) ───────────────── */}
      {tryOnModal && (
        <AIVirtualTryOn
          open
          onClose={() => setTryOnModal(false)}
          productImage={selectedProduct.img}
          productName={selectedProduct.name}
          productCategory={selectedProduct.category}
        />
      )}

      <Footer />
    </>
  );
};

export default Store;
