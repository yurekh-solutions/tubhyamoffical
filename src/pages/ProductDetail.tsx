import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import OptimizedImage from '@/components/OptimizedImage';
import PageLoader from '@/components/PageLoader';
import { getProductById, getProductsByCategory, getProductByIdSync, getProductsByCategorySync, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  ShoppingBag,
  Heart,
  Phone,
  ChevronLeft,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
  RefreshCw,
  Star,
  MessageCircle,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Static helpers                                                     */
/* ------------------------------------------------------------------ */

/** Maps product color names to hex values for circular swatches. */
const colorMap: Record<string, string> = {
  Black: '#1A1A1A',
  White: '#FFFFFF',
  'Off-White': '#F5F0E8',
  Grey: '#9CA3AF',
  Gray: '#9CA3AF',
  Charcoal: '#36454F',
  'Charcoal Grey': '#5A5A5A',
  'Slate Grey': '#708090',
  'Dark Silver': '#71797E',
  Graphite: '#41424C',
  Silver: '#C0C0C0',
  Navy: '#1B2A4A',
  'Navy Blue': '#1B2A4A',
  Blue: '#3B82F6',
  'Classic Blue': '#4A6FA5',
  'Light Wash': '#A8C5DA',
  'Medium Wash': '#6B8AAD',
  'Stone Wash': '#B5AFA0',
  'Dark Wash': '#3A5068',
  Olive: '#708238',
  'Olive Green': '#556B2F',
  Sage: '#9CAF88',
  Forest: '#228B22',
  Green: '#4CAF50',
  Beige: '#E8DCC8',
  Sand: '#C2B280',
  Cream: '#FFFDD0',
  Camel: '#C19A6B',
  Brown: '#8B4513',
  'Dark Brown': '#5C4033',
  Chocolate: '#3E2723',
  Tan: '#D2B48C',
  Khaki: '#C3B091',
  'Rose Gold': '#B76E79',
  Mauve: '#E0B0FF',
  Blush: '#DE5D83',
  Teal: '#008080',
  Peacock: '#1F6F78',
  Turquoise: '#40E0D0',
  Lavender: '#B57EDC',
  Multiple: 'linear-gradient(135deg,#e74c3c,#f1c40f,#2ecc71)',
};

/** Mock customer reviews displayed on every product page. */
const mockReviews = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    date: '15 Jun 2026',
    comment:
      'Excellent quality and fit! The fabric is so comfortable and the color is exactly as shown. Highly recommend!',
  },
  {
    name: 'Ananya Patel',
    location: 'Delhi',
    rating: 4,
    date: '10 Jun 2026',
    comment:
      'Great fit and good quality. Love the relaxed style — goes with almost everything in my wardrobe.',
  },
  {
    name: 'Sneha Reddy',
    location: 'Bangalore',
    rating: 3,
    date: '5 Jun 2026',
    comment:
      'Decent product, comfortable fabric. Slightly longer than expected and the color was a bit different from the photo.',
  },
  {
    name: 'Kavya Nair',
    location: 'Chennai',
    rating: 4,
    date: '1 Jun 2026',
    comment:
      'Really nice product overall. The quality is good and the finish looks premium. Worth the price.',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isLight } = useTheme();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<
    'idle' | 'checking' | 'available' | 'invalid'
  >('idle');

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      // Static-first: show product instantly from local data
      const syncProduct = getProductByIdSync(id);
      if (syncProduct) {
        setProduct(syncProduct);
        setLoading(false);
        const syncRelated = getProductsByCategorySync(syncProduct.category);
        setRelatedProducts(syncRelated.filter((p) => p.id !== id).slice(0, 4));
      }

      // Then refresh from API in background
      try {
        const apiProduct = await getProductById(id);
        if (apiProduct) {
          setProduct(apiProduct);
          const related = await getProductsByCategory(apiProduct.category);
          setRelatedProducts(related.filter((p) => p.id !== id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error refreshing product from API:', error);
      }

      if (!syncProduct) {
        setLoading(false);
      }
    };

    loadProduct();
    // Reset state when product changes
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    setActiveImage(0);
    setPincode('');
    setPincodeStatus('idle');
  }, [id]);

  // Map colors to their image indices (auto-calculated for multi-color products)
  const getColorImages = (color: string): number[] => {
    if (!product) return [0];
    const imagesPerColor = product.images.length / product.colors.length;
    if (Number.isInteger(imagesPerColor) && imagesPerColor > 1) {
      const colorIndex = product.colors.indexOf(color);
      if (colorIndex >= 0) {
        return Array.from(
          { length: imagesPerColor },
          (_, i) => colorIndex * imagesPerColor + i,
        );
      }
    }
    // Fallback: first image for any color
    return [0];
  };

  // Get images for selected color
  const filteredImages =
    selectedColor && product
      ? getColorImages(selectedColor)
      : product?.images.map((_, idx) => idx) || [];
  const displayImages = product
    ? filteredImages.map((idx) => product.images[idx])
    : [];
  const currentDisplayImage = selectedColor
    ? Math.min(activeImage, displayImages.length - 1)
    : activeImage;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !product) {
      return;
    }
    addToCart(product, selectedSize, selectedColor || product.colors[0]);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const message = `Hi! I'm interested in buying:\n\n${product.name}\nSize: ${selectedSize || 'Not selected'}\nColor: ${selectedColor || product.colors[0]}\nQuantity: ${quantity}\nPrice: ${formatPrice(product.price * quantity)}\n\nPlease confirm availability.`;
    window.open(
      `https://wa.me/917039382706?text=${encodeURIComponent(message)}`,
      '_blank',
    );
  };

  const handlePincodeCheck = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus('invalid');
      return;
    }
    setPincodeStatus('checking');
    // Simulate an API call
    setTimeout(() => {
      setPincodeStatus('available');
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <PageLoader message="Loading product details" />
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const rating = product.rating ?? 4.2;
  const reviewCount = product.reviewCount ?? 200;

  return (
    <div className={`min-h-screen ${isLight ? 'bg-[#F5F0E8]' : ''}`}>
      <Navbar />

      {/* Back to Shop */}
      <div className="container mx-auto px-4 pt-4 pb-2">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Back to Shop</span>
        </Link>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-primary transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{product.name}</span>
        </nav>
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Product Details                                           */}
      {/* ---------------------------------------------------------- */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ---- Image gallery: vertical thumbnails LEFT + main image RIGHT ---- */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex lg:flex-col gap-2 lg:w-16 lg:max-h-[560px] lg:overflow-y-auto pb-1">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-16 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentDisplayImage === idx
                        ? 'border-primary'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <OptimizedImage
                      src={img}
                      alt=""
                      containerClassName="absolute inset-0 w-full h-full"
                      aspectRatio="3/4"
                      objectFit="cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div
              className={`relative flex-1 aspect-[3/4] overflow-hidden rounded-2xl ${
                isLight ? 'bg-[#F5F0E8]' : 'bg-background'
              }`}
            >
              <OptimizedImage
                src={displayImages[currentDisplayImage]}
                alt={product.name}
                containerClassName="w-full h-full"
                aspectRatio="3/4"
                objectFit="cover"
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm ${
                      isLight ? 'bg-amber-600' : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    New
                  </span>
                )}
                {product.isBestSeller && (
                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm ${
                      isLight ? 'bg-amber-600' : 'bg-accent text-accent-foreground'
                    }`}
                  >
                    Bestseller
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm bg-[#E8652B]">
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100,
                    )}
                    % OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ---- Product info ---- */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary uppercase tracking-widest mb-2">
                {product.category}
              </p>
              <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-3">
                {product.name}
              </h1>

              {/* Star rating + review count */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= Math.round(rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="font-medium text-sm text-foreground">
                  {rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-heading text-3xl font-semibold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-white bg-[#E8652B] px-2 py-1 rounded-full">
                      {Math.round(
                        (1 - product.price / product.originalPrice) * 100,
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Short description */}
            <p className="text-muted-foreground leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Color selection — circular swatches */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">
                Color:{' '}
                <span className="text-muted-foreground font-normal">
                  {selectedColor || product.colors[0]}
                </span>
              </h4>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const isActive =
                    (selectedColor || product.colors[0]) === color;
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setActiveImage(0);
                      }}
                      title={color}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                        isActive
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span
                        className="absolute inset-1 rounded-full border border-black/5"
                        style={{
                          background: colorMap[color] || '#CCCCCC',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Select Size</h4>
                <Link
                  to="/size-guide"
                  className="text-sm text-primary hover:underline"
                >
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] h-11 px-4 rounded-lg border-2 font-semibold transition-all text-sm ${
                      selectedSize === size
                        ? isLight
                          ? 'border-[#2E241F] bg-[#2E241F] text-white'
                          : 'border-[#FFD3AC] bg-gradient-to-r from-[#FFD3AC] to-[#ffcd94] text-[#1A1410]'
                        : isLight
                          ? 'border-[#D4C5B5] text-foreground hover:border-[#2E241F]'
                          : 'border-[#3D3229] text-foreground hover:border-[#FFD3AC]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Quantity</h4>
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center border rounded-lg ${
                    isLight ? 'border-gray-300' : 'border-border'
                  }`}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`p-3 transition-colors rounded-l-lg ${
                      isLight ? 'hover:bg-gray-100' : 'hover:bg-secondary'
                    }`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`p-3 transition-colors rounded-r-lg ${
                      isLight ? 'hover:bg-gray-100' : 'hover:bg-secondary'
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-muted-foreground text-sm">
                  Total:{' '}
                  <span className="font-semibold text-foreground">
                    {formatPrice(product.price * quantity)}
                  </span>
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold transition-all text-sm ${
                  selectedSize
                    ? isLight
                      ? 'bg-[#2E241F] text-white hover:bg-[#1A1410] hover:shadow-lg active:scale-[0.98]'
                      : 'bg-white text-[#1A1410] hover:bg-gray-100 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98]'
                    : isLight
                      ? 'bg-[#D4C5B5] text-[#8A7D70] cursor-not-allowed'
                      : 'bg-[#3D3229] text-[#6B5E52] cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={18} />
                Add to Bag
              </button>
              <button
                onClick={handleWhatsApp}
                className={`flex-1 flex items-center justify-center gap-2 border-2 py-3.5 rounded-lg font-semibold transition-all text-sm ${
                  isLight
                    ? 'border-green-600 text-green-700 hover:bg-green-50 active:scale-[0.98]'
                    : 'border-green-500 text-green-400 hover:bg-green-950/30 active:scale-[0.98]'
                }`}
              >
                <Phone size={18} />
                Buy on WhatsApp
              </button>
              <button
                className={`p-3.5 rounded-lg border-2 transition-colors ${
                  isLight
                    ? 'border-[#D4C5B5] text-[#8A7D70] hover:border-[#2E241F] hover:text-[#2E241F]'
                    : 'border-[#3D3229] text-[#8A7D70] hover:border-[#FFD3AC] hover:text-[#FFD3AC]'
                }`}
              >
                <Heart size={20} />
              </button>
            </div>

            {/* Pincode delivery checker */}
            <div className="space-y-2 pt-2">
              <label className="font-medium text-sm">Check delivery</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePincodeCheck();
                  }}
                  placeholder="Enter 6-digit pincode"
                  className={`flex-1 px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-[#2D2D2D] transition-colors ${
                    isLight
                      ? 'border-gray-300 bg-white text-foreground placeholder:text-gray-400'
                      : 'border-border bg-secondary text-foreground placeholder:text-muted-foreground'
                  }`}
                />
                <button
                  onClick={handlePincodeCheck}
                  disabled={pincode.length !== 6}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    pincode.length === 6
                      ? isLight
                        ? 'bg-[#2E241F] text-white hover:bg-[#1A1410]'
                        : 'bg-gradient-to-r from-[#FFD3AC] to-[#ffcd94] text-[#1A1410] hover:shadow-md'
                      : isLight
                        ? 'bg-[#D4C5B5] text-[#8A7D70] cursor-not-allowed'
                        : 'bg-[#3D3229] text-[#6B5E52] cursor-not-allowed'
                  }`}
                >
                  Check
                </button>
              </div>
              {pincodeStatus === 'checking' && (
                <p className="text-sm text-muted-foreground">Checking…</p>
              )}
              {pincodeStatus === 'available' && (
                <p className="text-sm text-green-600 flex items-center gap-1.5">
                  <Check size={14} />
                  Delivery available in 3-5 days
                </p>
              )}
              {pincodeStatus === 'invalid' && (
                <p className="text-sm text-red-500">
                  Please enter a valid 6-digit pincode
                </p>
              )}
            </div>

            {/* Trust badges — 4 columns */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck size={24} className="mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="text-center">
                <Shield size={24} className="mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Secure Payment</p>
              </div>
              <div className="text-center">
                <RefreshCw size={24} className="mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">7-Day Returns</p>
              </div>
              <div className="text-center">
                <MessageCircle size={24} className="mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">
                  WhatsApp Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  Accordion sections                                       */}
      {/* ---------------------------------------------------------- */}
      <section className="container mx-auto px-4 py-8 max-w-3xl">
        <Accordion type="single" collapsible defaultValue="description">
          <AccordionItem
            value="description"
            className={isLight ? 'border-gray-200' : 'border-border'}
          >
            <AccordionTrigger className="font-heading text-lg hover:no-underline">
              Description
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="fabric"
            className={isLight ? 'border-gray-200' : 'border-border'}
          >
            <AccordionTrigger className="font-heading text-lg hover:no-underline">
              Fabric &amp; Care
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground mb-3">
                <span className="font-medium text-foreground">Fabric: </span>
                {product.fabric || product.material}
              </p>
              <ul className="space-y-1.5 text-muted-foreground">
                {(product.careInstructions || [
                  'Machine wash cold',
                  'Tumble dry low',
                  'Do not bleach',
                ]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="shipping"
            className={isLight ? 'border-gray-200' : 'border-border'}
          >
            <AccordionTrigger className="font-heading text-lg hover:no-underline">
              Shipping &amp; Returns
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground mb-3">
                Free shipping on all orders. Standard delivery in 3-5 business days.
              </p>
              <p className="text-muted-foreground">
                Easy 7-day returns. Item must be unused with tags attached.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  Customer reviews                                          */}
      {/* ---------------------------------------------------------- */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-semibold">
            Custo<span className="text-[#E8652B]">mer</span> Reviews
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={
                    star <= Math.round(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating} out of 5 · {reviewCount} reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {mockReviews.map((review, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl ${
                isLight
                  ? 'bg-white shadow-sm border border-gray-100'
                  : 'glass-card'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.location}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {review.date}
                </span>
              </div>
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-heading text-3xl font-semibold mb-8">
            You May Also <span className="text-gradient-gold">Like</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
