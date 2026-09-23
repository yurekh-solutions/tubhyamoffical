import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
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
      <div className="h-full">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl">
          <div className="product-image-zoom absolute inset-0 w-full h-full">
            <OptimizedImage
              src={currentImage}
              alt={product.name}
              containerClassName="absolute inset-0 w-full h-full"
              className="transition-transform duration-700 ease-out group-hover:scale-105"
              aspectRatio="3/4"
              priority={priority}
            />
          </div>
          
          {/* Subtle hover overlay */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${
            isLight ? 'bg-black/0 group-hover:bg-black/10' : 'bg-black/0 group-hover:bg-black/20'
          } opacity-0 group-hover:opacity-100`} />
          
          {/* Badges — compact, refined */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            {product.originalPrice && (
              <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-md font-medium leading-tight ${
                isLight
                  ? 'text-white bg-[#2E241F]/80'
                  : 'bg-white/90 text-[#2E241F]'
              }`}>
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
            {product.isBestSeller && (
              <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-md font-medium leading-tight ${
                isLight ? 'bg-[#8b5e3c]/90 text-white' : 'bg-white/90 text-[#5C3D2E]'
              }`}>
                Bestseller
              </span>
            )}
            {product.isNew && (
              <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-md font-medium leading-tight ${
                isLight ? 'bg-[#2E1A0E]/80 text-white' : 'bg-[#2E241F] text-white/90'
              }`}>
                New
              </span>
            )}
          </div>

          {/* Wishlist */}
          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button 
              className={`p-2 rounded-full transition-all duration-300 ${
                isInWishlist(product.id)
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                  : isLight
                    ? 'bg-white/90 text-[#2A1A0E] hover:bg-white shadow-md'
                    : 'bg-white/90 text-[#2A1A0E] hover:bg-white shadow-md'
              }`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
            >
              <Heart size={15} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Quick Add — slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-xs transition-all duration-300 ${
                isLight
                  ? 'bg-white/95 text-[#2E241F] hover:bg-white shadow-lg'
                  : 'bg-white/95 text-[#2E241F] hover:bg-white shadow-lg'
              }`}
            >
              <ShoppingBag size={14} />
              Quick Add
            </button>
          </div>
        </div>

        {/* Product Info — clean, minimal */}
        <div className="pt-3 pb-1 space-y-1">
          <h3 className={`font-heading text-[13px] md:text-sm leading-snug line-clamp-1 transition-colors duration-300 ${
            isLight ? 'text-[#2E241F] group-hover:text-[#8b5e3c]' : 'text-white/85 group-hover:text-white'
          }`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              isLight ? 'text-[#5A4E42]' : 'text-white/60'
            }`}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className={`text-xs line-through ${
                isLight ? 'text-[#9B8E82]' : 'text-white/30'
              }`}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
