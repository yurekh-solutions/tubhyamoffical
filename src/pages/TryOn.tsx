import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import { products as allProducts } from '@/data/products';

/* ------------------------------------------------------------------ */
/*  All products - show all, but only enable try-on for those with AI photos */
/* ------------------------------------------------------------------ */
const TRYON_PRODUCTS = allProducts
  .filter(p => p.id !== 'test-001')
  .map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    badge: p.isBestSeller ? 'Bestseller' : p.isNew ? 'New' : '',
    tryOnBodyVariants: p.tryOnBodyVariants || null,
  }));

/* ------------------------------------------------------------------ */
/*  Body types                                                         */
/* ------------------------------------------------------------------ */
const BODY_TYPES = [
  { id: 'slim' as const, label: 'Slim', icon: '👗' },
  { id: 'average' as const, label: 'Average', icon: '👚' },
  { id: 'plus-size' as const, label: 'Plus Size', icon: '👕' },
];

/* ------------------------------------------------------------------ */
/*  Colors                                                             */
/* ------------------------------------------------------------------ */
const COLORS = [
  { id: 'original', label: 'Original', hex: null },
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'navy', label: 'Navy', hex: '#1e3a5f' },
  { id: 'beige', label: 'Beige', hex: '#c9a882' },
  { id: 'grey', label: 'Grey', hex: '#6b6b6b' },
  { id: 'olive', label: 'Olive', hex: '#556b2f' },
  { id: 'brown', label: 'Brown', hex: '#5c4033' },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
const TryOn = () => {
  const { isLight } = useTheme();
  const [selectedProductId, setSelectedProductId] = useState(TRYON_PRODUCTS[0]?.id || '');
  const [selectedBodyType, setSelectedBodyType] = useState<'slim' | 'average' | 'plus-size'>('slim');
  const [selectedColor, setSelectedColor] = useState('original');
  const [activeCategory, setActiveCategory] = useState<'all' | 'formal' | 'jeans' | 'track'>('all');

  const selectedProduct = TRYON_PRODUCTS.find(p => p.id === selectedProductId);

  // Get current image based on body type
  const currentVariant = selectedProduct?.tryOnBodyVariants.find(v => v.bodyType === selectedBodyType);
  const currentImage = currentVariant?.images[0] || null;

  // Filter products by category
  const filteredProducts = TRYON_PRODUCTS.filter(p =>
    activeCategory === 'all' || p.category === activeCategory
  );

  /* ---- Theme tokens ---- */
  const T = {
    bg:          isLight ? '#FAF5EF' : '#0F0D0B',
    surface:     isLight ? '#FFFFFF' : '#1C1714',
    surfaceAlt:  isLight ? '#F5EDE4' : '#241E18',
    border:      isLight ? '#E0D5C8' : 'rgba(255,211,172,0.08)',
    text:        isLight ? '#1A1410' : '#FFF5EB',
    textSec:     isLight ? '#6B5E52' : 'rgba(255,211,172,0.7)',
    textMuted:   isLight ? '#9B8E82' : 'rgba(255,211,172,0.35)',
    accent:      '#8B5E3C',
    gradient:    'linear-gradient(135deg, #8B5E3C 0%, #A0714D 40%, #C9A882 100%)',
  };

  return (
    <>
      <SEO
        title="AI Fitting Room | Tubhyam - Try Before You Buy"
        description="Try Tubhyam products virtually with AI. See how our clothes look on different body types before you buy."
        keywords="virtual try on, AI fitting room, tubhyam try on, online fitting room, virtual fitting, try clothes online, AI fashion"
        url="https://www.tubhyam.in/try-on"
        breadcrumbItems={[{ name: 'AI Fitting Room', url: 'https://www.tubhyam.in/try-on' }]}
      />
      <Navbar />

      <div className="min-h-screen pt-20 pb-12" style={{ background: T.bg }}>
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
              <Sparkles size={16} style={{ color: T.accent }} />
              <span className="text-xs font-semibold" style={{ color: T.textSec }}>AI FITTING ROOM</span>
            </div>
            <h1 className="font-heading text-4xl mb-3" style={{ color: T.text }}>
              Try Before You <span style={{ color: T.accent }}>Buy</span>
            </h1>
            <p className="text-sm max-w-2xl mx-auto" style={{ color: T.textSec }}>
              Select a product, choose your body type, and see how it looks with AI-generated model photos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            {/* Left Panel - AI Model Display */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl sticky top-24" style={{ background: T.surface }}>
                {/* Image Display */}
                <div className="relative aspect-[3/4] bg-gray-100">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={`${selectedProduct?.name} - ${selectedBodyType} body type`}
                      className="w-full h-full object-cover"
                    />
                  ) : selectedProduct?.tryOnBodyVariants ? (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: T.textMuted }}>
                      <p className="text-sm">No photo for this body type</p>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center" style={{ color: T.textMuted }}>
                      <Sparkles size={48} className="mb-4 opacity-30" />
                      <p className="text-lg font-semibold mb-2">AI Photos Coming Soon</p>
                      <p className="text-sm">This product doesn't have AI model photos yet</p>
                    </div>
                  )}

                  {/* Product Info Overlay */}
                  {currentImage && selectedProduct && (
                    <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                      <div className="flex items-center gap-3">
                        <img src={selectedProduct.image} alt={selectedProduct.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{selectedProduct.name}</p>
                          <p className="text-[11px] text-white/60">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                        </div>
                        <Link to={`/product/${selectedProduct.id}`} className="px-3.5 py-2 rounded-xl text-[11px] font-bold text-white transition-all hover:scale-105 flex items-center gap-1" style={{ background: T.gradient }}>
                          <ShoppingBag size={12} />
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                {selectedProduct?.tryOnBodyVariants && (
                  <div className="p-4 space-y-4">
                    {/* Body Type Selector */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>Body Type</p>
                      <div className="flex gap-2">
                        {BODY_TYPES.map(bodyType => (
                          <button
                            key={bodyType.id}
                            onClick={() => setSelectedBodyType(bodyType.id)}
                            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                              selectedBodyType === bodyType.id
                                ? 'text-white shadow-md scale-105'
                                : 'border-2 hover:scale-105'
                            }`}
                            style={{
                              background: selectedBodyType === bodyType.id ? T.gradient : T.surfaceAlt,
                              borderColor: selectedBodyType === bodyType.id ? T.accent : T.border,
                              color: selectedBodyType === bodyType.id ? 'white' : T.text,
                            }}
                          >
                            <span className="block text-base mb-0.5">{bodyType.icon}</span>
                            {bodyType.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selector */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>Change Color</p>
                      <div className="flex flex-wrap gap-2">
                        {COLORS.map(color => (
                          <button
                            key={color.id}
                            onClick={() => setSelectedColor(color.id)}
                            className="relative w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110"
                            style={{
                              background: color.id === 'original' ? `url(${selectedProduct.image}) center/cover` : color.hex || '#fff',
                              borderColor: selectedColor === color.id ? T.accent : T.border,
                              boxShadow: selectedColor === color.id ? `0 0 0 2px ${T.accent}` : 'none',
                            }}
                            title={color.label}
                          >
                            {selectedColor === color.id && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check size={14} className={color.id === 'original' || color.hex === '#f5f5f5' ? 'text-gray-800' : 'text-white'} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Product Grid */}
            <div className="space-y-4">
              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(['all', 'formal', 'jeans', 'track'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveCategory(tab)}
                    className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === tab ? 'text-white shadow-md' : 'border-2'
                    }`}
                    style={{
                      background: activeCategory === tab ? T.gradient : T.surface,
                      borderColor: activeCategory === tab ? T.accent : T.border,
                      color: activeCategory === tab ? 'white' : T.text,
                    }}
                  >
                    {tab === 'all' ? 'All Items' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
                <div className="flex-1" />
                <p className="text-xs font-medium self-center px-3 py-2 rounded-full" style={{ color: T.textMuted, background: T.surface }}>
                  {filteredProducts.length} products
                </p>
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setSelectedBodyType('slim');
                        setSelectedColor('original');
                      }}
                      className={`rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] text-left ${
                        selectedProductId === product.id ? 'shadow-lg scale-[1.02]' : ''
                      }`}
                      style={{
                        background: T.surface,
                        borderColor: selectedProductId === product.id ? T.accent : T.border,
                      }}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        {product.badge && (
                          <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-[10px] font-bold text-white" style={{ background: T.gradient }}>
                            {product.badge}
                          </span>
                        )}
                        {selectedProductId === product.id && (
                          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md text-[10px] font-bold text-white flex items-center gap-1" style={{ background: T.gradient }}>
                            <Check size={10} /> Selected
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium truncate mb-1" style={{ color: T.text }}>{product.name}</p>
                        <p className="text-sm font-bold" style={{ color: T.accent }}>₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-lg mb-2" style={{ color: T.textMuted }}>No products with AI photos yet</p>
                  <p className="text-sm" style={{ color: T.textMuted }}>Check back soon for more try-on options!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TryOn;
