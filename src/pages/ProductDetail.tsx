import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProductById, getProductsByCategory, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Heart, Phone, ChevronLeft, Minus, Plus, Check, Truck, Shield, RefreshCw } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

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

  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }
    addToCart(product, selectedSize, selectedColor || product.colors[0]);
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in buying:\n\n${product.name}\nSize: ${selectedSize || 'Not selected'}\nColor: ${selectedColor || product.colors[0]}\nQuantity: ${quantity}\nPrice: ${formatPrice(product.price * quantity)}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/917039382706?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navbar />

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
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl glass-card">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
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
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
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
                <button className="text-sm text-primary hover:underline">Size Guide</button>
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
                    onClick={() => setSelectedColor(color)}
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
                <p className="text-xs text-muted-foreground">Free Shipping</p>
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
