import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
import { api } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

interface Order {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
  };
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  totalAmount: number;
  trackingNumber?: string;
  createdAt: string;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle },
  shipped: { label: 'Shipped', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle },
};

const OrderTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const urlOrderId = searchParams.get('orderId');
    if (urlOrderId) {
      setOrderId(urlOrderId);
      fetchOrder(urlOrderId);
    }
  }, []);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      setSearched(true);
      
      const data = await api.get<{ success: boolean; order: Order }>(`/orders/${id}`);
      if (data.success) {
        setOrder(data.order);
      }
    } catch (err) {
      setError('Order not found. Please check your order ID and try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ orderId });
    fetchOrder(orderId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const trackingSteps = [
    { key: 'pending', label: 'Order Placed', description: 'We have received your order' },
    { key: 'confirmed', label: 'Confirmed', description: 'Order has been confirmed' },
    { key: 'shipped', label: 'Shipped', description: 'Order is on the way' },
    { key: 'delivered', label: 'Delivered', description: 'Order delivered successfully' },
  ];

  const getStepStatus = (stepKey: string) => {
    if (!order) return 'pending';
    const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepKey);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <>
      <Helmet>
        <title>Track Order | Tubhyam</title>
        <meta name="description" content="Track your Tubhyam order status and delivery updates." />
      </Helmet>

      <Navbar />

      <div className="min-h-screen bg-background py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Track Your Order
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Enter your order ID to check the status
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 md:mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  placeholder="Enter Order ID (e.g., ORD-ABC123)"
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !orderId.trim()}
                className="px-4 md:px-6 py-2.5 md:py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50 text-sm md:text-base"
              >
                {loading ? '...' : 'Track'}
              </button>
            </div>
          </form>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">Fetching order details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <Link 
                to="/contact" 
                className="text-primary hover:underline text-sm"
              >
                Need help? Contact us
              </Link>
            </div>
          ) : order ? (
            <div className="space-y-4 md:space-y-6">
              {/* Order Status Header */}
              <div className="glass-card p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono font-semibold text-sm md:text-base">{order.orderId}</p>
                  </div>
                  {(() => {
                    const config = statusConfig[order.status];
                    const IconComponent = config.icon;
                    return (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${config.bgColor} ${config.color}`}>
                        <IconComponent size={14} />
                        {config.label}
                      </div>
                    );
                  })()}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Placed on {formatDate(order.createdAt)}
                </p>
                {order.trackingNumber && (
                  <p className="text-xs md:text-sm mt-1">
                    Tracking: <span className="font-mono font-medium">{order.trackingNumber}</span>
                  </p>
                )}
              </div>

              {/* Tracking Steps */}
              <div className="glass-card p-4 md:p-6">
                <h2 className="font-heading text-lg md:text-xl font-semibold mb-4 md:mb-6">Shipment Progress</h2>
                <div className="relative">
                  {trackingSteps.map((step, index) => {
                    const stepStatus = getStepStatus(step.key);
                    const isLast = index === trackingSteps.length - 1;
                    
                    return (
                      <div key={step.key} className="flex gap-3 md:gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                            stepStatus === 'completed' ? 'bg-green-500 text-white' :
                            stepStatus === 'current' ? 'bg-primary text-primary-foreground' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {stepStatus === 'completed' ? (
                              <CheckCircle size={16} className="md:w-5 md:h-5" />
                            ) : (
                              <span className="text-xs md:text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          {!isLast && (
                            <div className={`w-0.5 h-10 md:h-12 mt-1 ${
                              stepStatus === 'completed' ? 'bg-green-500' : 'bg-muted'
                            }`} />
                          )}
                        </div>
                        <div className={`pb-6 md:pb-8 ${stepStatus === 'pending' ? 'opacity-50' : ''}`}>
                          <p className="font-medium text-sm md:text-base">{step.label}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="glass-card p-4 md:p-6">
                <h2 className="font-heading text-lg md:text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-3 md:gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size} / {item.color}</p>
                        <p className="text-xs md:text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm md:text-base font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-base md:text-lg font-semibold">Total</span>
                    <span className="font-heading text-xl md:text-2xl font-bold text-primary">{formatPrice(order.totalAmount || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-primary" />
                  <h2 className="font-heading text-lg md:text-xl font-semibold">Shipping Address</h2>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-muted-foreground">{order.customer.phone}</p>
                  <p className="text-muted-foreground">{order.customer.address}</p>
                  <p className="text-muted-foreground">{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                </div>
              </div>
            </div>
          ) : searched ? null : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-sm">
                Enter your order ID above to track your shipment
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderTracking;
