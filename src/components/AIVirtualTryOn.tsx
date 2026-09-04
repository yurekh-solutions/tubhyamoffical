import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { products as allProducts } from '@/data/products';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface AIVirtualTryOnProps {
  open?: boolean;
  onClose?: () => void;
  standalone?: boolean;
  productImage?: string;
  productName?: string;
  productCategory?: string;
}

/* ------------------------------------------------------------------ */
/*  Store products — from full catalog                                 */
/* ------------------------------------------------------------------ */
const STORE_PRODUCTS = allProducts
  .filter(p => p.id !== 'test-001' && p.tryOnBodyVariants && p.tryOnBodyVariants.length > 0)
  .map(p => ({
    id: p.id,
    name: p.name,
    price: `₹${p.price.toLocaleString('en-IN')}`,
    img: p.image,
    rating: p.rating || 4.5,
    category: p.category,
    badge: p.isBestSeller ? 'Bestseller' : p.isNew ? 'New' : '',
  }));

// Available colors for try-on (with hex values for tinting)
const TRYON_COLORS = [
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
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const AIVirtualTryOn = ({
  open = true,
  onClose,
  standalone = false,
  productImage,
  productName,
  productCategory,
}: AIVirtualTryOnProps) => {
  const { isLight } = useTheme();

  const [selectedProduct, setSelectedProduct] = useState(STORE_PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState<string>('original');
  const [selectedBodyType, setSelectedBodyType] = useState<'slim' | 'average' | 'plus-size'>('slim');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'formal' | 'jeans' | 'track'>('all');

  // Get full product data with tryOnBodyVariants
  const fullProduct = allProducts.find(p => p.id === selectedProduct.id);

  // Update image when product, body type, or color changes
  useEffect(() => {
    if (fullProduct?.tryOnBodyVariants) {
      const variant = fullProduct.tryOnBodyVariants.find(v => v.bodyType === selectedBodyType);
      if (variant && variant.images.length > 0) {
        setCurrentImage(variant.images[0]);
      }
    }
  }, [selectedProduct.id, selectedBodyType, fullProduct]);

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

  const filteredProducts = STORE_PRODUCTS.filter(p => 
    activeTab === 'all' || p.category === activeTab
  );

  return (
    <div className={`min-h-screen ${standalone ? 'pt-20' : ''}`} style={{ background: T.bg }}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Left Panel - AI Model Display */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: T.surface }}>
              {/* Image Display */}
              <div className="relative aspect-[3/4] bg-gray-100">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={`${selectedProduct.name} - ${selectedBodyType} body type`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: T.textMuted }}>
                    <p>No AI photo available</p>
                  </div>
                )}

                {/* Product Info Overlay */}
                {currentImage && (
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <div className="flex items-center gap-3">
                      <img src={selectedProduct.img} alt={selectedProduct.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{selectedProduct.name}</p>
                        <p className="text-[11px] text-white/60">{selectedProduct.price}</p>
                      </div>
                      <Link to={`/product/${selectedProduct.id}`} className="px-3.5 py-2 rounded-xl text-[11px] font-bold text-white transition-all hover:scale-105" style={{ background: T.gradient }}>
                        Buy Now
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 space-y-4">
                {/* Body Type Selector */}
                {currentImage && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>Body Type</p>
                    <div className="flex gap-2">
                      {(['slim', 'average', 'plus-size'] as const).map(bodyType => (
                        <button
                          key={bodyType}
                          onClick={() => setSelectedBodyType(bodyType)}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                            selectedBodyType === bodyType
                              ? 'text-white shadow-md'
                              : 'border-2 hover:scale-105'
                          }`}
                          style={{
                            background: selectedBodyType === bodyType ? T.gradient : T.surfaceAlt,
                            borderColor: selectedBodyType === bodyType ? T.accent : T.border,
                            color: selectedBodyType === bodyType ? 'white' : T.text,
                          }}
                        >
                          {bodyType === 'slim' ? 'Slim' : bodyType === 'average' ? 'Average' : 'Plus Size'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {currentImage && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>Change Color</p>
                    <div className="flex flex-wrap gap-2">
                      {TRYON_COLORS.map(color => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className="relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
                          style={{
                            background: color.id === 'original' ? `url(${selectedProduct.img}) center/cover` : color.hex || '#fff',
                            borderColor: selectedColor === color.id ? T.accent : T.border,
                            boxShadow: selectedColor === color.id ? `0 0 0 2px ${T.accent}` : 'none',
                          }}
                          title={color.label}
                        >
                          {selectedColor === color.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check size={12} className={color.id === 'original' || color.hex === '#f5f5f5' ? 'text-gray-800' : 'text-white'} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Product Grid */}
          <div className="space-y-4">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['all', 'formal', 'jeans', 'track'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab ? 'text-white shadow-md' : 'border-2'
                  }`}
                  style={{
                    background: activeTab === tab ? T.gradient : T.surface,
                    borderColor: activeTab === tab ? T.accent : T.border,
                    color: activeTab === tab ? 'white' : T.text,
                  }}
                >
                  {tab === 'all' ? 'All Items' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              <div className="flex-1" />
              <p className="text-xs font-medium self-center" style={{ color: T.textMuted }}>
                {filteredProducts.length} products
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${
                    selectedProduct.id === product.id ? 'shadow-lg' : ''
                  }`}
                  style={{
                    background: T.surface,
                    borderColor: selectedProduct.id === product.id ? T.accent : T.border,
                  }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                    {product.badge && (
                      <span className="absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold text-white" style={{ background: T.gradient }}>
                        {product.badge}
                      </span>
                    )}
                    {selectedProduct.id === product.id && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold text-white flex items-center gap-1" style={{ background: T.gradient }}>
                        <Check size={10} /> Selected
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-left">
                    <p className="text-xs font-medium truncate mb-1" style={{ color: T.text }}>{product.name}</p>
                    <p className="text-sm font-bold" style={{ color: T.accent }}>{product.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVirtualTryOn;
