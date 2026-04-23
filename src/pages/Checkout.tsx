import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, Phone, Mail, User, CreditCard, Truck, Package, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { api } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
}

const Checkout = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerDetails> = {};
    
    if (!customer.name.trim()) newErrors.name = 'Name is required';
    if (!customer.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[6-9]\d{9}$/.test(customer.phone.trim())) {
      newErrors.phone = 'Enter valid 10-digit phone number';
    }
    if (!customer.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      newErrors.email = 'Enter valid email address';
    }
    if (!customer.address.trim()) newErrors.address = 'Address is required';
    if (!customer.city.trim()) newErrors.city = 'City is required';
    if (!customer.pincode.trim()) {
      newErrors.pincode = 'PIN code is required';
    } else if (!/^\d{6}$/.test(customer.pincode.trim())) {
      newErrors.pincode = 'Enter valid 6-digit PIN code';
    }
    if (!customer.state.trim()) newErrors.state = 'State is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (items.length === 0) return;
    
    setLoading(true);
    
    try {
      const orderData = {
        customer,
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product.image,
        })),
        totalAmount: totalPrice,
        paymentMethod,
      };
      
      const response = await api.post<{ success: boolean; orderId: string; message: string }>('/orders', orderData);
      
      if (response.success) {
        clearCart();
        navigate('/order-confirmation', { 
          state: { 
            orderId: response.orderId,
            customer,
            totalAmount: totalPrice,
            paymentMethod,
          } 
        });
      }
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Failed to place order. Please try again or contact us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CustomerDetails, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-20">
          <div className="container mx-auto px-4 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-heading text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some items to proceed with checkout</p>
            <Link to="/products" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Tubhyam</title>
        <meta name="description" content="Complete your order at Tubhyam. Secure checkout with Cash on Delivery." />
      </Helmet>

      <Navbar />
      
      <div className="min-h-screen bg-background py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Link 
              to="/cart" 
              className="inline-flex items-center gap-2 text-sm md:text-base text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={18} />
              Back to Cart
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold">Checkout</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Details */}
                <div className="glass-card p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <User size={20} className="text-primary" />
                    <h2 className="font-heading text-lg md:text-xl font-semibold">Customer Details</h2>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={customer.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-destructive' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Phone Number *</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="tel"
                          value={customer.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.phone ? 'border-destructive' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                        />
                      </div>
                      {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${errors.email ? 'border-destructive' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="glass-card p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <MapPin size={20} className="text-primary" />
                    <h2 className="font-heading text-lg md:text-xl font-semibold">Shipping Address</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Full Address *</label>
                      <textarea
                        value={customer.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.address ? 'border-destructive' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none`}
                        placeholder="House no, building, street, area"
                      />
                      {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">City *</label>
                        <input
                          type="text"
                          value={customer.city}
                          onChange={(e) => handleChange('city', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.city ? 'border-destructive' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                          placeholder="City"
                        />
                        {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1.5">PIN Code *</label>
                        <input
                          type="text"
                          value={customer.pincode}
                          onChange={(e) => handleChange('pincode', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.pincode ? 'border-destructive' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                          placeholder="6-digit PIN"
                          maxLength={6}
                        />
                        {errors.pincode && <p className="text-destructive text-xs mt-1">{errors.pincode}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1.5">State *</label>
                        <input
                          type="text"
                          value={customer.state}
                          onChange={(e) => handleChange('state', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border ${errors.state ? 'border-destructive' : 'border-border'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                          placeholder="State"
                        />
                        {errors.state && <p className="text-destructive text-xs mt-1">{errors.state}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="glass-card p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <CreditCard size={20} className="text-primary" />
                    <h2 className="font-heading text-lg md:text-xl font-semibold">Payment Method</h2>
                  </div>
                  
                  <div className="space-y-3">
                    <label 
                      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Truck size={18} className="text-primary" />
                          <span className="font-medium text-sm sm:text-base">Cash on Delivery</span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Pay when you receive your order</p>
                      </div>
                      <CheckCircle size={20} className={`text-primary transition-opacity ${paymentMethod === 'cod' ? 'opacity-100' : 'opacity-0'}`} />
                    </label>

                    <label 
                      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all opacity-60 ${
                        paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="w-4 h-4 accent-primary"
                        disabled
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard size={18} className="text-primary" />
                          <span className="font-medium text-sm sm:text-base">Online Payment</span>
                          <span className="text-[10px] sm:text-xs bg-muted px-2 py-0.5 rounded-full">Coming Soon</span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Razorpay integration - Currently unavailable</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button - Mobile */}
                <div className="lg:hidden">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 md:py-4 bg-primary text-primary-foreground rounded-xl font-medium text-sm md:text-base hover:bg-primary/90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                  >
                    {loading ? 'Placing Order...' : `Place Order - ${formatPrice(totalPrice)}`}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-4 md:p-6 lg:sticky lg:top-24">
                <h2 className="font-heading text-lg md:text-xl font-semibold mb-4 md:mb-6">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size} / {item.color}</p>
                        <p className="text-xs md:text-sm font-medium">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs md:text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-3 md:pt-4 space-y-2">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-heading text-base md:text-lg font-semibold">Total</span>
                      <span className="font-heading text-xl md:text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Desktop */}
                <div className="hidden lg:block mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3.5 md:py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                  >
                    {loading ? 'Placing Order...' : `Place Order - ${formatPrice(totalPrice)}`}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Package size={14} />
                  <span>Free shipping on all orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Checkout;
