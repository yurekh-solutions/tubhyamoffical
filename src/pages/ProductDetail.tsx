import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import OptimizedImage from '@/components/OptimizedImage';
import PageLoader from '@/components/PageLoader';
import { getProductById, getProductsByCategory, getProductByIdSync, getProductsByCategorySync, resolveProductId, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
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
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Static helpers                                                     */
/* ------------------------------------------------------------------ */

/** Maps product color names to hex values for circular swatches. */
const colorMap: Record<string, string> = {
  Black: '#1A1A1A',
  White: '#FFFFFF',
  'Off-White': '#F5F0E8',
  Grey: '#A0A0A0',
  Gray: '#A0A0A0',
  Charcoal: '#3A3A3A',
  'Charcoal Grey': '#4A4A4A',
  'Slate Grey': '#5C6370',
  'Dark Silver': '#6B6B6B',
  Graphite: '#3D3D3D',
  Silver: '#C0C0C0',
  Navy: '#1C2331',
  'Navy Blue': '#1C2331',
  Blue: '#2D5F8A',
  'Classic Blue': '#2E4A6B',
  'Light Wash': '#9AB3C7',
  'Medium Wash': '#5A7A95',
  'Stone Wash': '#B0A898',
  'Dark Wash': '#2F4356',
  Olive: '#6B7C3E',
  'Olive Green': '#4F6027',
  Sage: '#8FA37E',
  Forest: '#2D6A2E',
  Green: '#3E7B42',
  Beige: '#D9CCBA',
  Sand: '#BDA97D',
  Cream: '#F5F0DC',
  Camel: '#B8916A',
  Brown: '#7A4A2D',
  'Dark Brown': '#4A3228',
  Chocolate: '#3E2723',
  Tan: '#C9A882',
  Khaki: '#B8A88A',
  'Rose Gold': '#B76E79',
  Mauve: '#C9A0C9',
  Blush: '#D4849A',
  Teal: '#2A7A7A',
  Peacock: '#1F6F78',
  Turquoise: '#3CB5AD',
  Lavender: '#A78BCA',
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

function getStoredReviews(productId: string) {
  try {
    const stored = localStorage.getItem(`reviews-${productId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isLight } = useTheme();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<
    'idle' | 'checking' | 'available' | 'invalid'
  >('idle');

  // Review state — must be declared before any early returns
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [userReviews, setUserReviews] = useState<{name:string;location:string;rating:number;date:string;comment:string}[]>(() =>
    id ? getStoredReviews(id) : []
  );

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    // Fisher-Yates shuffle so "You May Also Like" shows a different
    // random 4 on every load instead of the same first-4 from the
    // category. We spread first to keep the source array immutable.
    const pickRandom = <T,>(arr: T[], n: number): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice(0, n);
    };

    // ── STEP 1: sync-first render ──────────────────────────────────
    // Try to show the curated product instantly (<2s target).
    // Case-insensitive lookup means both 'FP-005' and 'fp-005' hit.
    const syncProduct = getProductByIdSync(id);
    if (syncProduct) {
      setProduct(syncProduct);
      setLoading(false);
      const syncRelated = getProductsByCategorySync(syncProduct.category);
      setRelatedProducts(pickRandom(syncRelated.filter((p) => p.id !== syncProduct.id), 4));
    }

    // ── STEP 2: background resolution (non-blocking) ────────────────
    // Either confirms the sync product (merging fresh inStock flag), or
    // resolves a stale MongoDB _id URL to its curated product. The 8s
    // AbortController in api.ts guarantees this always settles.
    (async () => {
      try {
        const resolved = await resolveProductId(id);
        if (cancelled) return;
        if (resolved) {
          setProduct(resolved);
          const related = await getProductsByCategory(resolved.category);
          if (cancelled) return;
          // Only update related products if API returned results; otherwise keep sync data
          if (related.length > 0) {
            setRelatedProducts(pickRandom(related.filter((p) => p.id !== resolved.id), 4));
          }
        }
      } catch (err) {
        // Timeout / 5xx / network error — the sync product (if any) is
        // already on screen, so just log and move on.
        console.warn('ProductDetail: background resolve failed:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    // Reset interactive state when product changes
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    setActiveImage(0);
    setPincode('');
    setPincodeStatus('idle');

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Map colors to their image indices (auto-calculated for multi-color products)
  const getColorImages = (color: string): number[] => {
    if (!product) return [0];

    // Use explicit colorImages mapping if available
    if (product.colorImages && product.colorImages[color]) {
      const colorImgs = product.colorImages[color];
      const indices = colorImgs
        .map((img: string) => product.images.indexOf(img))
        .filter((i: number) => i >= 0);
      if (indices.length > 0) return indices;
    }

    // Fallback: even distribution across colors
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
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);
    addToCart(product, selectedSize, selectedColor || product.colors[0], quantity);
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

  if (!product || product.price <= 1) {
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

  // Deterministic review count per product (2, 3, or 4) based on product ID
  const reviewSeed = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const maxReviews = 2 + (reviewSeed % 3); // 2, 3, or 4
  const allReviews = [...userReviews, ...mockReviews];
  const displayReviews = allReviews.slice(0, maxReviews);
  const reviewCount = displayReviews.length;
  const rating = product.rating ?? parseFloat((displayReviews.reduce((sum, r) => sum + r.rating, 0) / displayReviews.length).toFixed(1));

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim() || reviewRating === 0 || !product) return;
    const newReview = {
      name: reviewName.trim(),
      location: reviewLocation.trim() || 'India',
      rating: reviewRating,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      comment: reviewComment.trim(),
    };
    const updated = [newReview, ...userReviews];
    setUserReviews(updated);
    localStorage.setItem(`reviews-${product.id}`, JSON.stringify(updated));
    setShowReviewForm(false);
    setReviewName('');
    setReviewLocation('');
    setReviewRating(0);
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className={`min-h-screen ${isLight ? 'bg-[#F5F0E8]' : ''}`}>
      <Navbar />

      {/* Back to Shop */}
      <div className="container  mx-auto px-4 pt-20 pb-2">
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
            <div className="flex-1 flex flex-col gap-2">
              <div
                className={`relative aspect-[3/4] overflow-hidden rounded-2xl ${
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
                    <span className="text-white text-sm px-4 py-2 rounded-lg font-semibold bg-[#8B7355] tracking-wide shadow-sm">
                      New
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="text-white text-sm px-4 py-2 rounded-lg font-semibold bg-[#8B7355] tracking-wide shadow-sm">
                      Bestseller
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-white text-sm px-4 py-2 rounded-lg font-bold bg-[#8B5E3C] tracking-wide shadow-sm">
                      {Math.round(
                        (1 - product.price / product.originalPrice) * 100,
                      )}
                      % OFF
                    </span>
                  )}
                </div>
              </div>
              {/* Per-image caption (only when captions are defined for this image) */}
              {product.imageCaptions &&
                product.imageCaptions[displayImages[currentDisplayImage]] && (
                  <p className={`text-xs sm:text-sm text-center italic px-2 py-1 ${
                    isLight ? 'text-[#4A3228]' : 'text-muted-foreground'
                  }`}>
                    {product.imageCaptions[displayImages[currentDisplayImage]]}
                  </p>
                )}
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
                    <span className="text-sm font-bold text-white bg-[#8B5E3C] px-3 py-1.5 rounded-lg tracking-wide">
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

            {/* Color selection — circular swatches (always show when product has colors) */}
            {product.colors.length >= 1 && (
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
                            ? 'border-[#8B7355] ring-2 ring-[#8B7355]/30'
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
            )}

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
                    onClick={() => { setSelectedSize(size); setShowSizeError(false); }}
                    className={`min-w-[3rem] h-11 px-4 rounded-lg border-2 font-semibold transition-all text-sm ${
                      selectedSize === size
                        ? isLight
                          ? 'border-[#2E241F] bg-[#2E241F] text-white'
                          : 'border-[#FFD3AC] bg-gradient-to-r from-[#FFD3AC] to-[#ffcd94] text-[#1A1410]'
                        : showSizeError
                          ? 'border-red-400 text-foreground hover:border-red-500 animate-pulse'
                          : isLight
                            ? 'border-[#D4C5B5] text-foreground hover:border-[#2E241F]'
                            : 'border-[#3D3229] text-foreground hover:border-[#FFD3AC]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {/* Size error popup */}
              {showSizeError && (
                <div className="flex items-center gap-2 text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                  Please select a size before adding to bag
                </div>
              )}
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
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-xl transition-all active:scale-95 ${
                    isInWishlist(product.id)
                      ? 'bg-red-50 border-2 border-red-400 text-red-500'
                      : isLight
                        ? 'border-2 border-[#D4C5B5] text-[#8A7D70] hover:border-[#2E241F] hover:text-[#2E241F]'
                        : 'glass-card text-[#8A7D70] hover:text-[#FFD3AC] active:scale-[0.98]'
                  }`}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all text-sm ${
                    selectedSize
                      ? isLight
                        ? 'bg-[#2E241F] text-white hover:bg-[#1A1410] hover:shadow-lg active:scale-[0.98]'
                        : 'glass-card bg-white/90 text-[#1A1410] hover:bg-white hover:shadow-lg hover:shadow-white/10 active:scale-[0.98]'
                      : showSizeError
                        ? isLight
                          ? 'bg-red-100 text-red-700 border-2 border-red-400'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : isLight
                          ? 'bg-[#D4C5B5] text-[#8A7D70] cursor-not-allowed'
                          : 'glass-card bg-white/10 text-[#6B5E52] cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag size={18} />
                  {showSizeError ? 'Select a Size' : 'Add to Bag'}
                </button>
              </div>
              <button
                onClick={handleWhatsApp}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all text-sm ${
                  isLight
                    ? 'border-2 border-green-600 text-green-700 hover:bg-green-50 active:scale-[0.98]'
                    : 'glass-card bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 active:scale-[0.98] shadow-lg shadow-green-500/10'
                }`}
              >
                <Phone size={18} />
                Buy on WhatsApp
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
            Custo<span className="text-[#8b5e3c]">mer</span> Reviews
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
              {rating} out of 5 · {reviewCount} customer reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {displayReviews.map((review, i) => (
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

        {/* Write a Review */}
        <div className="max-w-4xl mx-auto mt-10">
          {reviewSubmitted && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
              Thank you! Your review has been submitted.
            </div>
          )}

          {!showReviewForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowReviewForm(true)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  isLight
                    ? 'bg-[#2E1A0E] text-white hover:bg-[#4A3228]'
                    : 'bg-[#8B5E3C] text-white hover:bg-[#A0714D]'
                }`}
              >
                <Star size={18} />
                Write a Review
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmitReview}
              className={`p-6 sm:p-8 rounded-2xl ${
                isLight
                  ? 'bg-white shadow-md border border-gray-100'
                  : 'glass-card border border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Write Your Review
                </h3>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="p-1 hover:bg-secondary/50 rounded-full transition-colors"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              {/* Star Rating */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHover(star)}
                      onMouseLeave={() => setReviewHover(0)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          star <= (reviewHover || reviewRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                  {(reviewHover || reviewRating) > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {(reviewHover || reviewRating)} / 5
                    </span>
                  )}
                </div>
              </div>

              {/* Name + Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    required
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      isLight
                        ? 'bg-gray-50 border-gray-200 text-foreground'
                        : 'bg-secondary/50 border-border text-foreground'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      isLight
                        ? 'bg-gray-50 border-gray-200 text-foreground'
                        : 'bg-secondary/50 border-border text-foreground'
                    }`}
                  />
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  required
                  rows={4}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                    isLight
                      ? 'bg-white border-gray-200 text-foreground'
                      : 'bg-secondary/50 border-border text-foreground'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={reviewRating === 0}
                className={`w-full sm:w-auto px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  reviewRating === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isLight
                      ? 'bg-[#2E1A0E] text-white hover:bg-[#4A3228]'
                      : 'bg-[#8B5E3C] text-white hover:bg-[#A0714D]'
                }`}
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-heading text-3xl font-semibold mb-8">
            Related <span className="text-gradient-gold">Products</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
