import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/data/products';
import { useTheme } from '@/context/ThemeContext';
import { useWishlist } from '@/context/WishlistContext';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard = ({ product, priority = false }: ProductCardProps) => {
  const { isLight } = useTheme();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [showSecondImage, setShowSecondImage] = useState(false);
  const hasMultipleImages = product.images && product.images.length > 1;
  const currentImage = showSecondImage && hasMultipleImages ? product.images[1] : product.image;

  // Quick Add now takes the user INTO the product detail page first,
  // so they can browse images, description, and pick their own size.
  // No item is added to the bag until the user selects a size on the
  // detail page — prevents wrong-size cart entries.
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  // Deterministic per-product review count (2, 3, or 4) — same seed as
  // ProductDetail.tsx so the card and detail page agree on the count.
  const reviewSeed = product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const reviewCount = 2 + (reviewSeed % 3);
  const rating = 4 + ((reviewSeed % 10) / 10); // 4.0 – 4.9

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
          
          {/* Badges — compact single row */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[75%]">
            {product.originalPrice && (
              <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-full font-bold leading-tight ${
                isLight
                  ? 'text-white bg-[#E8652B]'
                  : 'bg-[#8B5E3C] text-white'
              }`}>
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
            {product.isBestSeller && (
              <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-full font-semibold leading-tight ${
                isLight ? 'bg-[#8b5e3c] text-white' : 'bg-[#5C3D2E] text-[#FFD3AC]'
              }`}>
                Bestseller
              </span>
            )}
            {product.isNew && (
              <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-full font-semibold leading-tight ${
                isLight ? 'bg-[#2E1A0E] text-white' : 'bg-[#3B2A1A] text-white/90'
              }`}>
                New
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <button 
              className={`p-2.5 glass-card backdrop-blur-xl border border-white/20 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${
                isInWishlist(product.id)
                  ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                  : 'hover:bg-primary hover:text-white hover:border-primary'
              }`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Quick Add Button — takes the user to the product detail
              page where they pick their size before adding to bag. */}
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
          {product.description && (
            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
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

          {/* Dynamic per-product rating + review count */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  className={
                    star <= Math.round(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : isLight
                        ? 'text-gray-300'
                        : 'text-gray-600'
                  }
                />
              ))}
            </div>
            <span className={`text-[10px] sm:text-xs font-medium ${isLight ? 'text-[#4A3228]' : 'text-foreground'}`}>
              {rating.toFixed(1)}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              ({reviewCount})
            </span>
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
