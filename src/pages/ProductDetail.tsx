import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import OptimizedImage from '@/components/OptimizedImage';
import PageLoader from '@/components/PageLoader';
import { getProductById, getProductsByCategory, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Heart, Phone, ChevronLeft, Minus, Plus, Check, Truck, Shield, RefreshCw } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        
        if (data) {
          const related = await getProductsByCategory(data.category);
          setRelatedProducts(related.filter(p => p.id !== id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // Reset state when product changes
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    setActiveImage(0);
  }, [id]);

  // Map colors to their image indices
  const getColorImages = (color: string): number[] => {
    const colorImages: Record<string, number[]> = {
      'Grey': [0, 1],
      'Black': [2, 3],
      'Lavender': [4, 5],
    };
    return colorImages[color] || [0];
  };

  // Get images for selected color
  const filteredImages = selectedColor && product ? getColorImages(selectedColor) : product?.images.map((_, idx) => idx) || [];
  const displayImages = product ? filteredImages.map(idx => product.images[idx]) : [];
  const currentDisplayImage = selectedColor ? Math.min(activeImage, displayImages.length - 1) : activeImage;

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
    window.open(`https://wa.me/917039382706?text=${encodeURIComponent(message)}`, '_blank');
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
          <Link to="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Back to Shop */}
      <div className="container mx-auto px-4 pt-4 pb-2">
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shop</span>
        </Link>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product Details */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-background">
              <OptimizedImage
                src={displayImages[currentDisplayImage]}
                alt={product.name}
                containerClassName="w-full h-full"
                aspectRatio="3/4"
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">New</span>
                )}
                {product.isBestSeller && (
                  <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium">Bestseller</span>
                )}
                {product.originalPrice && (
                  <span className="bg-destructive text-destructive-foreground text-xs px-3 py-1 rounded-full font-medium">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% Off
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-3">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentDisplayImage === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <OptimizedImage
                      src={img}
                      alt=""
                      containerClassName="w-full h-full"
                      aspectRatio="3/4"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-4">{product.name}</h1>
              
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-3xl font-semibold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Select Size</h4>
                <Link to="/size-guide" className="text-sm text-primary hover:underline">Size Guide</Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] h-12 px-4 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-sm text-destructive">Please select a size</p>
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <h4 className="font-medium">Color: {selectedColor || product.colors[0]}</h4>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setActiveImage(0);
                    }}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2 ${
                      (selectedColor || product.colors[0]) === color
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {(selectedColor || product.colors[0]) === color && <Check size={14} className="text-primary" />}
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <h4 className="font-medium">Quantity</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors rounded-l-lg"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors rounded-r-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-muted-foreground text-sm">
                  Total: <span className="font-semibold text-foreground">{formatPrice(product.price * quantity)}</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-medium transition-all ${
                  selectedSize
                    ? 'bg-primary text-primary-foreground hover:shadow-elegant'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-medium transition-colors"
              >
                <Phone size={18} />
                Buy on WhatsApp
              </button>
              <button className="p-4 glass-card rounded-lg hover:border-primary/30 transition-colors">
                <Heart size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
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
                <p className="text-xs text-muted-foreground">7 Day Returns</p>
              </div>
            </div>
          </div>
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
