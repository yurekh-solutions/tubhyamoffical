import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import { products as allProducts, type Product } from '@/data/products';
import TryOnViewer from '@/components/StyleStudio/TryOnViewer';
import type { SkinTone } from '@/data/styleStudioModels';

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

const SKIN_TONES: { name: SkinTone; color: string }[] = [
  { name: 'Fair', color: '#F5D0B0' },
  { name: 'Light', color: '#E8B896' },
  { name: 'Medium', color: '#D4A574' },
  { name: 'Tan', color: '#C4956A' },
  { name: 'Honey', color: '#A67B5B' },
  { name: 'Deep', color: '#6B4423' },
];

const BODY_SHAPES: { value: 'slim' | 'average' | 'plus-size'; label: string }[] = [
  { value: 'slim', label: 'Slim' },
  { value: 'average', label: 'Average' },
  { value: 'plus-size', label: 'Plus Size' },
];

const GARMENT_TYPES: { value: 'formal' | 'jeans' | 'track'; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'jeans', label: 'Jeans' },
  { value: 'track', label: 'Track' },
];

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'formal', label: 'Formal' },
  { value: 'jeans', label: 'Jeans' },
  { value: 'track', label: 'Track' },
];

// Map product color names to hex for the fallback mannequin pants
const COLOR_MAP: Record<string, string> = {
  beige: '#D9C7AE', cream: '#EFE6D5', ivory: '#F2EDE2', white: '#F5F2EC',
  black: '#2B2724', charcoal: '#3A3633', grey: '#8A8580', gray: '#8A8580',
  brown: '#7A5236', chocolate: '#5C3A24', tan: '#B08558', camel: '#B98A5A',
  olive: '#6B6B3F', green: '#4E6B4A', sage: '#9CAF88', khaki: '#A89A6E',
  navy: '#2B3A55', blue: '#3E5C8A', denim: '#4A6A8C', indigo: '#3A4A6B',
  maroon: '#6B2B2B', burgundy: '#6B2436', red: '#A03A3A', rust: '#9A4A2E',
  pink: '#D9A0A8', blush: '#E3B7B7', lavender: '#A99AC4', purple: '#6B4A7A',
  mustard: '#C49A2E', yellow: '#D4B03A', orange: '#C4702E',
  // Multi-word color names
  'olive green': '#6B6B3F',
  'navy blue': '#2B3A55',
  'classic blue': '#3E5C8A',
  'light wash': '#A8C4D8',
  'rose gold': '#B8766A',
  'dark brown': '#5C3A24',
  teal: '#2E8B8B',
  'mint green': '#98D4B5',
  'dusty rose': '#C9A0A0',
};

const getColorHex = (name?: string): string => {
  if (!name) return '#8B5E3C';
  const key = name.toLowerCase();
  if (COLOR_MAP[key]) return COLOR_MAP[key];
  // Word-splitting fallback: try last word first (base color), then earlier words
  const words = key.split(/\s+/);
  for (let i = words.length - 1; i >= 0; i--) {
    if (COLOR_MAP[words[i]]) return COLOR_MAP[words[i]];
  }
  return '#8B5E3C';
};

const StyleStudio = () => {
  const { isLight } = useTheme();
  const [searchParams] = useSearchParams();

  // Resolve initial product from ?product=<id> query param
  const resolvedProduct = useMemo(() => {
    const query = searchParams.get('product');
    if (!query) return null;
    return (
      allProducts.find(
        p => p.id === query || p.mongoId === query || p.sku === query
      ) || null
    );
  }, [searchParams]);

  // Safe fallback: first non-test product (price > 1), then allProducts[0]
  const safeFallback = useMemo(() => {
    return allProducts.find(p => p.price > 1) || allProducts[0];
  }, []);

  const initialProduct = resolvedProduct || safeFallback;

  // Model state (female-only reusable model)
  const [size, setSize] = useState('M');
  const [skinTone, setSkinTone] = useState<SkinTone>('Medium');
  const [bodyShape, setBodyShape] = useState<'slim' | 'average' | 'plus-size'>('average');
  const [garmentType, setGarmentType] = useState<'formal' | 'jeans' | 'track'>(initialProduct.category);

  // Product browser state
  const [categoryFilter, setCategoryFilter] = useState<string>(
    resolvedProduct ? resolvedProduct.category : 'all'
  );
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProduct);
  const [selectedColor, setSelectedColor] = useState<string>(initialProduct.colors?.[0] || '');
  const productColor = getColorHex(selectedColor);

  // Accordion
  const [openSection, setOpenSection] = useState<string>('size');

  // Filtered products (exclude test product)
  const filteredProducts = useMemo(() => {
    const list = allProducts.filter(p => p.price > 1);
    if (categoryFilter === 'all') return list;
    return list.filter(p => p.category === categoryFilter);
  }, [categoryFilter]);

  const T = {
    bg: isLight ? '#FAF5EF' : '#0F0D0B',
    surface: isLight ? '#FFFFFF' : '#1C1714',
    surfaceAlt: isLight ? '#F5EDE4' : '#241E18',
    border: isLight ? '#E0D5C8' : 'rgba(255,211,172,0.15)',
    text: isLight ? '#1A1410' : '#FFF5EB',
    textSec: isLight ? '#6B5E52' : 'rgba(255,211,172,0.7)',
    textMuted: isLight ? '#9B8E82' : 'rgba(255,211,172,0.5)',
    accent: '#8B5E3C',
    gradient: 'linear-gradient(135deg, #8B5E3C 0%, #A0714D 40%, #C9A882 100%)',
  };

  const sectionBtn = (id: string, label: string, value: string) => (
    <button
      onClick={() => setOpenSection(openSection === id ? '' : id)}
      className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
      style={{ background: T.surface, border: `1px solid ${openSection === id ? T.accent : T.border}` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>
          {label}
        </span>
        <span className="font-semibold text-sm" style={{ color: T.text }}>{value}</span>
      </div>
      <ChevronDown size={18} style={{ color: T.textMuted, transform: openSection === id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
    </button>
  );

  const pillBtn = (key: string, active: boolean, onClick: () => void, label: string) => (
    <button
      key={key}
      onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
      style={{
        background: active ? T.gradient : T.surface,
        color: active ? 'white' : T.text,
        border: `1px solid ${active ? T.accent : T.border}`,
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      <SEO
        title="Tubhyam Style Studio | Visualize Your Perfect Fit"
        description="Style Studio - customize body shape, size and skin tone, and see Tubhyam products on a real model. Personalized fashion visualization."
        url="https://www.tubhyam.in/style-studio"
      />
      <Navbar />

      <div className="min-h-screen pt-20" style={{ background: T.bg }}>
        {/* Top Banner */}
        <div className="w-full py-3 text-center text-white text-xs tracking-wider" style={{ background: '#2E1A0E' }}>
          STYLE STUDIO · CUSTOMIZE YOUR LOOK · SEE IT ON A REAL MODEL
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Back + Product Info */}
          <div className="flex items-center gap-4 mb-8">
            <Link to={`/product/${selectedProduct.id}`} className="flex items-center gap-2 text-sm font-medium" style={{ color: T.accent }}>
              <ArrowLeft size={16} />
              View Product
            </Link>
            <div className="h-5 w-px" style={{ background: T.border }} />
            <div>
              <h1 className="font-heading text-2xl font-semibold" style={{ color: T.text }}>{selectedProduct.name}</h1>
              <p className="text-sm" style={{ color: T.textSec }}>₹{selectedProduct.price?.toLocaleString('en-IN')} · {selectedProduct.category}</p>
            </div>
          </div>

          {/* Color Swatches */}
          {selectedProduct.colors && selectedProduct.colors.length > 1 && (
            <div className="flex items-center gap-3 mb-6 ml-16">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: T.textMuted }}>Color</span>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors.map(c => {
                  const hex = getColorHex(c);
                  const isActive = selectedColor === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      className="rounded-full transition-all"
                      style={{
                        width: 28,
                        height: 28,
                        background: hex,
                        border: `2px solid ${isActive ? T.accent : T.border}`,
                        transform: isActive ? 'scale(1.15)' : 'scale(1)',
                        boxShadow: isActive ? `0 0 0 2px ${T.bg}, 0 0 0 4px ${T.accent}` : 'none',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Customization Panel */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: T.accent }}>
                Customize Your Model
              </p>

              {/* Body Shape */}
              <div>
                {sectionBtn('body', 'Body Shape', bodyShape === 'plus-size' ? 'Plus Size' : bodyShape.charAt(0).toUpperCase() + bodyShape.slice(1))}
                {openSection === 'body' && (
                  <div className="flex flex-wrap gap-2 p-4 mt-2 rounded-xl" style={{ background: T.surfaceAlt }}>
                    {BODY_SHAPES.map(b => pillBtn(b.value, bodyShape === b.value, () => setBodyShape(b.value), b.label))}
                  </div>
                )}
              </div>

              {/* Size */}
              <div>
                {sectionBtn('size', 'Size', size)}
                {openSection === 'size' && (
                  <div className="flex flex-wrap gap-2 p-4 mt-2 rounded-xl" style={{ background: T.surfaceAlt }}>
                    {SIZES.map(sz => pillBtn(sz, size === sz, () => setSize(sz), sz))}
                  </div>
                )}
              </div>

              {/* Skin Tone */}
              <div>
                {sectionBtn('skin', 'Skin Tone', skinTone)}
                {openSection === 'skin' && (
                  <div className="flex flex-wrap gap-3 p-4 mt-2 rounded-xl" style={{ background: T.surfaceAlt }}>
                    {SKIN_TONES.map(st => (
                      <button
                        key={st.name}
                        onClick={() => setSkinTone(st.name)}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div
                          className="w-10 h-10 rounded-full border-2 transition-all"
                          style={{
                            background: st.color,
                            borderColor: skinTone === st.name ? T.accent : 'transparent',
                            transform: skinTone === st.name ? 'scale(1.1)' : 'scale(1)',
                          }}
                        />
                        <span className="text-[10px]" style={{ color: skinTone === st.name ? T.accent : T.textMuted }}>{st.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Garment Type */}
              <div>
                {sectionBtn('garment', 'Garment Type', garmentType.charAt(0).toUpperCase() + garmentType.slice(1))}
                {openSection === 'garment' && (
                  <div className="flex flex-wrap gap-2 p-4 mt-2 rounded-xl" style={{ background: T.surfaceAlt }}>
                    {GARMENT_TYPES.map(g => pillBtn(g.value, garmentType === g.value, () => setGarmentType(g.value), g.label))}
                  </div>
                )}
              </div>

              {/* Product Browser */}
              <div>
                {sectionBtn('product', 'Product', selectedProduct.name.length > 28 ? selectedProduct.name.slice(0, 26) + '…' : selectedProduct.name)}
                {openSection === 'product' && (
                  <div className="p-4 mt-2 rounded-xl space-y-3" style={{ background: T.surfaceAlt }}>
                    {/* Category filter */}
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(c => pillBtn(c.value, categoryFilter === c.value, () => setCategoryFilter(c.value), c.label))}
                    </div>
                    {/* Product list */}
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: 'thin' }}>
                      {filteredProducts.map(p => {
                        const isActive = selectedProduct.id === p.id;
                        const colorHex = getColorHex(p.colors?.[0]);
                        return (
                          <button
                            key={p.id}
                            onClick={() => { setSelectedProduct(p); setGarmentType(p.category); setSelectedColor(p.colors?.[0] || ''); }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all"
                            style={{
                              background: isActive ? T.surface : 'transparent',
                              border: `1px solid ${isActive ? T.accent : 'transparent'}`,
                            }}
                          >
                            {/* Color swatch */}
                            <div className="w-8 h-8 rounded-md shrink-0" style={{ background: colorHex, border: `1px solid ${T.border}` }} />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate" style={{ color: T.text }}>{p.name}</p>
                              <p className="text-[10px]" style={{ color: T.textMuted }}>₹{p.price.toLocaleString('en-IN')} · {p.category}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary + CTA */}
              <div className="p-5 rounded-2xl space-y-4" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: T.textMuted }}>Size</p>
                    <p className="font-semibold" style={{ color: T.text }}>{size}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: T.textMuted }}>Skin</p>
                    <p className="font-semibold" style={{ color: T.text }}>{skinTone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: T.textMuted }}>Shape</p>
                    <p className="font-semibold" style={{ color: T.text }}>{bodyShape === 'plus-size' ? 'Plus Size' : bodyShape.charAt(0).toUpperCase() + bodyShape.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: T.textMuted }}>Type</p>
                    <p className="font-semibold" style={{ color: T.text }}>{garmentType.charAt(0).toUpperCase() + garmentType.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: T.textMuted }}>Color</p>
                    <p className="font-semibold truncate" style={{ color: T.text }}>{selectedColor || '—'}</p>
                  </div>
                </div>
                <div className="pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
                  <p className="text-2xl font-bold mb-3" style={{ color: T.accent }}>
                    ₹{selectedProduct.price?.toLocaleString('en-IN')}
                  </p>
                  <button
                    className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ background: T.gradient }}
                  >
                    <ShoppingBag size={18} />
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Reusable Model Try-On Preview */}
            <div className="lg:sticky lg:top-24">
              <TryOnViewer
                product={selectedProduct}
                bodyShape={bodyShape}
                skinTone={skinTone}
                size={size}
                garmentColor={productColor}
                garmentType={garmentType}
              />
              <p className="text-center text-xs mt-4" style={{ color: T.textMuted }}>
                Reusable model · {bodyShape === 'plus-size' ? 'Plus Size' : bodyShape.charAt(0).toUpperCase() + bodyShape.slice(1)} · Size {size} · {skinTone} skin · {garmentType}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StyleStudio;
