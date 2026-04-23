import { Link, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Package, Truck, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, customer, totalAmount, paymentMethod } = location.state || {};

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const steps = [
    { icon: CheckCircle, label: 'Order Placed', status: 'completed' },
    { icon: Package, label: 'Processing', status: 'pending' },
    { icon: Truck, label: 'Shipped', status: 'pending' },
    { icon: CheckCircle, label: 'Delivered', status: 'pending' },
  ];

  return (
    <>
      <Helmet>
        <title>Order Confirmed | Tubhyam</title>
        <meta name="description" content="Your order has been placed successfully. Thank you for shopping with Tubhyam!" />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-background py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Thank you for shopping with Tubhyam
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Order Details Card */}
            <div className="glass-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg md:text-xl font-semibold">Order Details</h2>
                <span className="text-xs md:text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  Confirmed
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-semibold">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="glass-card p-4 md:p-6">
              <h2 className="font-heading text-lg md:text-xl font-semibold mb-4">Shipping Details</h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{customer?.name}</p>
                <p className="text-muted-foreground">{customer?.phone}</p>
                <p className="text-muted-foreground">{customer?.email}</p>
                <p className="text-muted-foreground mt-2">{customer?.address}</p>
                <p className="text-muted-foreground">{customer?.city}, {customer?.state} - {customer?.pincode}</p>
              </div>
            </div>

            {/* Order Tracking Steps */}
            <div className="glass-card p-4 md:p-6">
              <h2 className="font-heading text-lg md:text-xl font-semibold mb-4 md:mb-6">Order Status</h2>
              <div className="flex justify-between items-start">
                {steps.map((step, index) => (
                  <div key={step.label} className="flex flex-col items-center flex-1 relative">
                    {index < steps.length - 1 && (
                      <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center relative z-10 ${
                      step.status === 'completed' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <step.icon size={16} className="md:w-5 md:h-5" />
                    </div>
                    <span className={`text-[10px] md:text-xs mt-2 text-center font-medium ${
                      step.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-secondary/30 rounded-xl p-4 md:p-5">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">What happens next?</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    You will receive an order confirmation message shortly. We'll process your order within 24 hours and update you with tracking details once shipped.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
              <Link
                to={`/track-order?orderId=${orderId}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] text-center"
              >
                <Truck size={18} />
                Track Order
              </Link>
              <Link
                to="/products"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 glass-card border-2 border-primary/30 rounded-xl font-medium hover:border-primary transition-all hover:scale-[1.02] text-center"
              >
                <ShoppingBag size={18} />
                Continue Shopping
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderConfirmation;
