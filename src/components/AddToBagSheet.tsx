import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

const AddToBagSheet = () => {
  const { lastAddedItem, isAddToBagSheetOpen, setIsAddToBagSheetOpen, setIsCartOpen, totalItems } = useCart();
  const { isLight } = useTheme();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleViewBag = () => {
    setIsAddToBagSheetOpen(false);
    setIsCartOpen(true);
  };

  const handleContinueShopping = () => {
    setIsAddToBagSheetOpen(false);
  };

  if (!lastAddedItem) return null;

  const { product, size, color, quantity } = lastAddedItem;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAddToBagSheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleContinueShopping}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${
          isAddToBagSheetOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className={`rounded-t-3xl max-h-[85vh] overflow-y-auto ${
          isLight ? 'bg-white shadow-2xl' : 'bg-[#1A1410] border-t border-white/10 shadow-2xl'
        }`}>
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className={`w-10 h-1 rounded-full ${isLight ? 'bg-gray-300' : 'bg-white/20'}`} />
          </div>

          {/* Success Header */}
          <div className="px-6 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-semibold">Added to Bag!</h3>
              </div>
              <button
                onClick={handleContinueShopping}
                className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className={`px-6 py-4 ${isLight ? 'bg-gray-50' : 'bg-white/5'}`}>
            <div className="flex gap-4">
              <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-border/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-semibold text-sm line-clamp-2">{product.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {size}{color ? ` • ${color}` : ''}{quantity > 1 ? ` • Qty: ${quantity}` : ''}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-primary">
                    {formatPrice(product.price * quantity)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.originalPrice * quantity)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cart summary */}
          <div className="px-6 py-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in bag
            </span>
            <span className="font-semibold">
              Bag Total: {formatPrice(product.price * quantity)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-8 pt-2 flex flex-col gap-3">
            <button
              onClick={handleViewBag}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all ${
                isLight
                  ? 'bg-[#2E241F] text-white hover:bg-[#1A1410] active:scale-[0.98]'
                  : 'bg-white text-[#1A1410] hover:bg-gray-100 active:scale-[0.98]'
              }`}
            >
              <ShoppingBag size={18} />
              View Bag ({totalItems})
            </button>
            <button
              onClick={handleContinueShopping}
              className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all ${
                isLight
                  ? 'bg-gray-100 text-[#2E241F] hover:bg-gray-200 active:scale-[0.98]'
                  : 'bg-white/10 text-white/90 hover:bg-white/15 active:scale-[0.98]'
              }`}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToBagSheet;
