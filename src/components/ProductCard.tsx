import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

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
    <Link to={`/product/${product.id}`} className="group block">
      <div className="glass-card-hover">
        {/* Image Container */}
        <div className="relative product-image-zoom aspect-[3/4] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium">
                Bestseller
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-destructive text-destructive-foreground text-xs px-3 py-1 rounded-full font-medium">
                Sale
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="p-2 glass-card hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <Heart size={18} />
            </button>
          </div>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <button
              onClick={handleQuickAdd}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag size={16} />
              Quick Add
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-heading text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Colors */}
          <div className="flex items-center gap-1 pt-1">
            {product.colors.map((color) => (
              <span 
                key={color}
                className="text-xs text-muted-foreground"
              >
                {color}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
