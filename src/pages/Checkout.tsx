import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, CreditCard, MapPin, User, Phone, Mail, Loader2, Shield, Truck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCustomerInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = () => {
    return (
      customerInfo.name.trim() !== '' &&
      customerInfo.phone.trim().length >= 10 &&
      customerInfo.address.trim() !== '' &&
      customerInfo.city.trim() !== '' &&
      customerInfo.state.trim() !== '' &&
      customerInfo.pincode.trim().length === 6
    );
  };

  const handlePayment = async () => {
    if (!isFormValid()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const finalAmount = totalPrice >= 2000 ? totalPrice : totalPrice + 99;

    setLoading(true);

    try {
      // Step 1: Create order on backend
      const orderResponse = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'INR',
          receipt: `tubhyam_${Date.now()}`,
          notes: {
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            customerEmail: customerInfo.email,
            shippingAddress: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`,
            items: items.map(i => `${i.product.name} (${i.size}, ${i.color}) x${i.quantity}`).join(' | '),
          },
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Server is currently unavailable. Please try again or order via WhatsApp.');
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Tubhyam',
        description: `${items.length} item(s) | ${customerInfo.name}`,
        image: logo,
        order_id: orderData.order.id,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await fetch(`${API_URL}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success('Payment successful! Order confirmed.');
              clearCart();
              navigate('/order-confirmation', {
                state: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  amount: finalAmount,
                  items,
                  customerInfo,
                },
              });
            } else {
              toast.error('Payment verification failed. Contact support.');
            }
          } catch {
            toast.error('Payment verification error. Please contact support.');
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`,
        },
        theme: {
          color: '#ffd3ac',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info('Payment was cancelled. You can try again anytime.');
          },
          confirm_close: true,
          escape: false,
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      razorpayInstance.on('payment.failed', (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      razorpayInstance.open();
    } catch (error: unknown) {
      console.error('Payment error:', error);
      const msg = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-6" />
          <h1 className="font-heading text-3xl mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to your cart to checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                <User size={20} className="text-primary" />
                Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    <Phone size={14} className="inline mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    <Mail size={14} className="inline mr-1" />
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="House no., Building, Street, Area"
                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">State *</label>
                    <select
                      name="state"
                      value={customerInfo.state}
                      onChange={handleInputChange}
                      className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={customerInfo.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN"
                      maxLength={6}
                      className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl space-y-5 sticky top-24">
              <h2 className="font-heading text-xl font-semibold">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 pb-3 border-b border-border/50">
                    <div className="w-14 h-16 rounded-lg overflow-hidden bg-secondary/30 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} · {item.color} · Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-0.5">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-500 font-medium">
                    {totalPrice >= 2000 ? 'FREE' : formatPrice(99)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/50">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice(totalPrice >= 2000 ? totalPrice : totalPrice + 99)}
                  </span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={loading || !isFormValid()}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base transition-all ${
                  isFormValid() && !loading
                    ? 'bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay {formatPrice(totalPrice >= 2000 ? totalPrice : totalPrice + 99)}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-muted-foreground">
                Secured by Razorpay. UPI, Cards, Net Banking accepted.
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                <div className="text-center">
                  <Shield size={18} className="mx-auto text-primary mb-1" />
                  <p className="text-[10px] text-muted-foreground">Secure Payment</p>
                </div>
                <div className="text-center">
                  <Truck size={18} className="mx-auto text-primary mb-1" />
                  <p className="text-[10px] text-muted-foreground">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <RefreshCw size={18} className="mx-auto text-primary mb-1" />
                  <p className="text-[10px] text-muted-foreground">7 Day Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
