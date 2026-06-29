import { X, Plus, Minus, Trash2, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const CartSidebar = () => {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    totalPrice,
    totalItems,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppCheckout = () => {
    const message = items.map(item => 
      `• ${item.product.name} (${item.size}, ${item.color}) x${item.quantity} - ${formatPrice(item.product.price * item.quantity)}`
    ).join('\n');
    
    const fullMessage = `Hi! I'd like to order the following items:\n\n${message}\n\nTotal: ${formatPrice(totalPrice)}\n\nPlease confirm availability.`;
    
    window.open(`https://wa.me/917039382706?text=${encodeURIComponent(fullMessage)}`, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:max-w-sm md:max-w-md bg-card/95 backdrop-blur-xl border-l border-border/50 shadow-2xl z-40 transition-transform duration-500 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-secondary/20 to-transparent backdrop-blur-sm sticky top-0 z-10">
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">Your Cart</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2.5 hover:bg-secondary/50 rounded-full transition-all hover:rotate-90 duration-300 flex-shrink-0"
            >
              <X size={20} className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-foreground mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mb-6">Start adding items to your cart</p>
                <Link 
                  to="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full font-medium transition-all hover:scale-105"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="flex gap-4 glass-card p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Link 
                      to={`/product/${item.product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="w-24 h-28 flex-shrink-0 overflow-hidden rounded-lg border border-border/30 hover:border-primary/50 transition-colors"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/product/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-heading font-medium line-clamp-2 hover:text-primary transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.size} • {item.color}
                      </p>
                      <p className="font-semibold text-primary mt-2">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                            className="p-2 hover:bg-secondary transition-colors rounded-l-lg"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            className="p-2 hover:bg-secondary transition-colors rounded-r-lg"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border/50 p-6 space-y-4 bg-gradient-to-t from-secondary/10 to-transparent backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-base text-muted-foreground">Subtotal</span>
                <span className="font-heading font-bold text-2xl text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">Shipping calculated at checkout</p>
              
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3.5 rounded-xl font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Phone size={18} />
                Order via WhatsApp
              </button>
              
              <Link 
                to="/products"
                onClick={() => setIsCartOpen(false)}
                className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors link-underline"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
