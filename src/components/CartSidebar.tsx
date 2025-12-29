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
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transition-transform duration-500 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-heading text-2xl font-semibold">Your Cart ({totalItems})</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Link 
                  to="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="text-primary link-underline font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="flex gap-4 glass-card p-4"
                  >
                    <Link 
                      to={`/product/${item.product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-lg"
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
            <div className="border-t border-border p-6 space-y-4 bg-card">
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-heading font-semibold text-xl">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
              
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-medium transition-colors"
              >
                <Phone size={18} />
                Order via WhatsApp
              </button>
              
              <Link 
                to="/products"
                onClick={() => setIsCartOpen(false)}
                className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
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
