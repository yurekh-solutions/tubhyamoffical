import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, Phone, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Cart = () => {
  const { 
    items, 
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
      <Navbar />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={18} className="md:w-5 md:h-5" />
              <span>Continue Shopping</span>
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Shopping Cart</h1>
                <p className="text-sm md:text-base text-muted-foreground">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-16 h-16 text-muted-foreground" />
              </div>
              <h2 className="font-heading text-2xl font-semibold mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-md">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link 
                to="/products"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-105"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="glass-card p-4 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6 hover:shadow-lg transition-all"
                  >
                    <Link 
                      to={`/product/${item.product.id}`}
                      className="w-full sm:w-24 md:w-32 h-32 sm:h-32 md:h-40 flex-shrink-0 overflow-hidden rounded-lg border border-border/30 hover:border-primary/50 transition-colors"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${item.product.id}`}
                            className="font-heading text-base md:text-lg font-semibold hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex flex-wrap gap-2 md:gap-3 mt-2 text-xs md:text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              Size: <span className="font-medium text-foreground">{item.size}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              Color: <span className="font-medium text-foreground">{item.color}</span>
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                          className="p-2 h-fit text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} className="md:w-5 md:h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-auto">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="text-xs md:text-sm text-muted-foreground">Qty:</span>
                          <div className="flex items-center gap-1 md:gap-2 bg-secondary/50 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                              className="p-1.5 md:p-2 hover:bg-secondary transition-colors rounded-l-lg"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} className="md:w-4 md:h-4" />
                            </button>
                            <span className="w-10 md:w-12 text-center text-sm md:text-base font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                              className="p-1.5 md:p-2 hover:bg-secondary transition-colors rounded-r-lg"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} className="md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="text-left sm:text-right">
                          <p className="text-xs md:text-sm text-muted-foreground">Price</p>
                          <p className="font-heading text-xl md:text-2xl font-bold text-primary">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="glass-card p-4 md:p-6 lg:sticky lg:top-24">
                  <h2 className="font-heading text-lg md:text-xl font-semibold mb-4 md:mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-xs md:text-sm">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-border pt-3 md:pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-heading text-base md:text-lg font-semibold">Total</span>
                        <span className="font-heading text-xl md:text-2xl font-bold text-primary">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 md:py-4 rounded-xl text-sm md:text-base font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl mb-3 md:mb-4"
                  >
                    <CreditCard size={18} className="md:w-5 md:h-5" />
                    Proceed to Checkout
                  </Link>

                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-all hover:scale-105 mb-3"
                  >
                    <Phone size={16} className="md:w-4 md:h-4" />
                    Or Order via WhatsApp
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    Cash on Delivery available. Free shipping on all orders.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
