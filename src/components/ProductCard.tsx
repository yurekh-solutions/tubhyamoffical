import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard = ({ product, priority = false }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isLight } = useTheme();
  const [showSecondImage, setShowSecondImage] = useState(false);
  const hasMultipleImages = product.images && product.images.length > 1;
  const currentImage = showSecondImage && hasMultipleImages ? product.images[1] : product.image;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block h-full" onMouseEnter={() => hasMultipleImages && setShowSecondImage(true)} onMouseLeave={() => hasMultipleImages && setShowSecondImage(false)}>
      <div className={`h-full rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
        isLight
          ? 'bg-white border border-gray-200 hover:border-primary/30'
          : 'glass-card border border-white/10 hover:border-primary/30'
      }`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <div className="product-image-zoom absolute inset-0 w-full h-full">
            <OptimizedImage
              src={currentImage}
              alt={product.name}
              containerClassName="absolute inset-0 w-full h-full bg-background"
              className="transition-transform duration-700 group-hover:scale-105"
              aspectRatio="3/4"
              priority={priority}
            />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className={`text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm ${
                isLight ? 'bg-amber-600' : 'glass-card bg-primary/90 backdrop-blur-md border border-white/20'
              }`}>
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className={`text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm ${
                isLight ? 'bg-amber-600' : 'glass-card bg-accent/90 backdrop-blur-md border border-white/20'
              }`}>
                Bestseller
              </span>
            )}
            {product.originalPrice && (
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold shadow-sm ${
                isLight
                  ? 'text-white bg-[#E8652B]'
                  : 'glass-card bg-[#3B2A1A]/70 backdrop-blur-md border border-white/10 text-[#FFD3AC]'
              }`}>
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <button 
              className="p-2.5 glass-card backdrop-blur-xl border border-white/20 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:scale-110 shadow-lg"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <Heart size={18} />
            </button>
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm border transition-all duration-300 hover:scale-105 shadow-xl ${
                isLight
                  ? 'bg-white text-foreground border-gray-200 hover:bg-gray-50'
                  : 'glass-card backdrop-blur-xl bg-white/90 text-foreground border-white/30 hover:bg-white'
              }`}
            >
              <ShoppingBag size={18} />
              Quick Add
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className={`space-y-2 md:space-y-2.5 ${
          isLight ? 'p-2.5 sm:p-4' : 'p-3 md:p-5 bg-gradient-to-b from-background/50 to-background backdrop-blur-sm'
        }`}>
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            {product.category}
          </p>
          <h3 className="font-heading text-xs sm:text-sm md:text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-lg text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Colors */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {product.colors.slice(0, 3).map((color, index) => (
              <span 
                key={color}
                className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full"
              >
                {color}
              </span>
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
