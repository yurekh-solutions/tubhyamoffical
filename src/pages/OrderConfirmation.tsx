import { useLocation, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, Package, ArrowRight, MapPin, Receipt } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const state = location.state as {
    paymentId?: string;
    orderId?: string;
    amount?: number;
    items?: Array<{ product: { name: string; price: number }; quantity: number; size: string; color: string }>;
    customerInfo?: { name: string; phone: string; address: string; city: string; state: string; pincode: string };
  } | null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
          <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Payment Details */}
        {state && (
          <div className="glass-card p-6 rounded-2xl text-left space-y-4 mb-8">
            <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
              <Package size={20} className="text-primary" />
              Order Details
            </h2>

            {/* Shipping Status */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-sm font-medium">Processing your order</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                We'll create your shipment and send tracking details via WhatsApp shortly.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              {state.paymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-xs">{state.paymentId}</span>
                </div>
              )}
              {state.orderId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-xs">{state.orderId}</span>
                </div>
              )}
              {state.amount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-primary">{formatPrice(state.amount)}</span>
                </div>
              )}
            </div>

            {/* Items */}
            {state.items && state.items.length > 0 && (
              <div className="pt-4 border-t border-border/50 space-y-2">
                <p className="text-sm font-medium">Items Ordered:</p>
                {state.items.map((item, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground flex justify-between">
                    <span>{item.product.name} ({item.size}, {item.color}) x{item.quantity}</span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Shipping Address */}
            {state.customerInfo && (
              <div className="pt-4 border-t border-border/50 space-y-1">
                <p className="text-sm font-medium">Shipping to:</p>
                <p className="text-sm text-muted-foreground">
                  {state.customerInfo.name}<br />
                  {state.customerInfo.address}<br />
                  {state.customerInfo.city}, {state.customerInfo.state} - {state.customerInfo.pincode}<br />
                  Phone: {state.customerInfo.phone}
                </p>
              </div>
            )}
          </div>
        )}

        {/* WhatsApp Support */}
        <div className="glass-card p-5 rounded-2xl mb-8">
          <p className="text-sm text-muted-foreground">
            We'll send order updates via WhatsApp. For any queries, message us at{' '}
            <a href="https://wa.me/917039382706" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              +91 70393 82706
            </a>
          </p>
        </div>

        {/* Track Order + My Orders + Continue Shopping */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Receipt size={18} />
            View My Orders
          </Link>
          <Link
            to="/track-order"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-8 py-3 rounded-lg font-medium hover:bg-primary/20 transition-colors"
          >
            <MapPin size={18} />
            Track Order
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
