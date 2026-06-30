import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';

interface OrderItem {
  name?: string;
  sku?: string;
  quantity?: number;
  price?: number;
}

interface Order {
  id?: string;
  status?: string;
  shippingStatus?: string;
  awbCode?: string;
  items?: OrderItem[];
  amount?: number;
  createdAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://tubhyamoffical.onrender.com/api';

const TrackOrder = () => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'shipped':
      case 'in_transit':
        return <Truck size={16} className="text-blue-500" />;
      case 'processing':
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'cancelled':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTrack = async () => {
    if (!phone.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);
    setOrders([]);

    try {
      const res = await fetch(`${API_URL}/orders/track-by-phone?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
        if ((data.orders || []).length === 0) {
          setError('No orders found for this phone number. Please check and try again.');
        }
      } else {
        setError(data.message || 'Failed to track orders');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your phone number to check order status
          </p>
        </div>

        {/* Search Form */}
        <div className="glass-card p-6 rounded-2xl mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                maxLength={10}
              />
            </div>
            <button
              onClick={handleTrack}
              disabled={loading || !phone.trim()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={18} />
              )}
              Track
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Order Results */}
        {searched && orders.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold">
              {orders.length} Order{orders.length > 1 ? 's' : ''} Found
            </h2>

            {orders.map((order, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl space-y-4">
                {/* Order Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm font-semibold">{order.id}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(order.shippingStatus || order.status)}`}>
                    {getStatusIcon(order.shippingStatus || order.status)}
                    <span className="capitalize">{(order.shippingStatus || order.status).replace('_', ' ')}</span>
                  </div>
                </div>

                {/* AWB Code */}
                {order.awbCode && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Tracking Number (AWB)</p>
                    <p className="font-mono text-sm font-semibold text-primary">{order.awbCode}</p>
                  </div>
                )}

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    {order.items.map((item: OrderItem, itemIdx: number) => (
                      <div key={itemIdx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} {item.sku && <span className="text-xs">({item.sku})</span>} × {item.quantity}
                        </span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Amount */}
                <div className="flex justify-between pt-2 border-t border-border/50">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-semibold text-primary text-lg">{formatPrice(order.amount)}</span>
                </div>

                {/* Date */}
                {order.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {searched && orders.length === 0 && !error && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Simple phone icon component
const Phone = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export default TrackOrder;
