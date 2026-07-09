import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  ShoppingBag,
  MapPin,
  Receipt,
  Calendar,
  CreditCard,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useOrderHistory, OrderHistoryItem } from '@/context/OrderHistoryContext';
import { useTheme } from '@/context/ThemeContext';

const Orders = () => {
  const { orders } = useOrderHistory();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isLight = theme === 'light';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusMeta = (status: OrderHistoryItem['status']) => {
    switch (status) {
      case 'delivered':
        return {
          label: 'Delivered',
          Icon: CheckCircle,
          chip: 'bg-green-500/15 text-green-500 border-green-500/30',
        };
      case 'shipped':
        return {
          label: 'Shipped',
          Icon: Truck,
          chip: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          Icon: AlertCircle,
          chip: 'bg-red-500/15 text-red-500 border-red-500/30',
        };
      case 'processing':
      default:
        return {
          label: 'Processing',
          Icon: Clock,
          chip: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-10 md:py-14 max-w-4xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-1">
                My <span className="text-gradient-gold">Orders</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                {orders.length === 0
                  ? 'You have no orders yet.'
                  : `${orders.length} order${orders.length === 1 ? '' : 's'} placed on this device.`}
              </p>
            </div>
            <button
              onClick={() => navigate('/track-order')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border border-border hover:border-primary/50 transition-colors"
            >
              <MapPin size={14} />
              Track a shipment
            </button>
          </div>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 md:p-14 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-secondary/40 flex items-center justify-center">
              <ShoppingBag size={34} className="text-muted-foreground" />
            </div>
            <h2 className="font-heading text-xl md:text-2xl font-semibold mb-2">
              No orders yet
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Once you complete a purchase, your order history will appear here so
              you can review items, amounts, and payment IDs anytime.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <ShoppingBag size={16} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-5">
            {orders.map((order) => {
              const meta = getStatusMeta(order.status);
              const StatusIcon = meta.Icon;
              return (
                <article
                  key={order.id}
                  className={`glass-card rounded-2xl overflow-hidden ${
                    isLight ? 'bg-white/70' : ''
                  }`}
                >
                  {/* Top bar: order id, date, status */}
                  <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-border/40">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Receipt size={16} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Order ID
                        </p>
                        <p className="font-mono text-xs sm:text-sm font-semibold truncate">
                          {order.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${meta.chip}`}
                      >
                        <StatusIcon size={12} />
                        {meta.label}
                      </span>
                    </div>
                  </header>

                  {/* Items */}
                  <div className="px-5 py-4 space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 sm:gap-4 items-center"
                      >
                        <Link
                          to={`/product/${item.id}`}
                          className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border border-border/30 flex-shrink-0 bg-secondary/20"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.id}`}
                            className="font-medium text-sm sm:text-base line-clamp-2 hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.size} · {item.color} · Qty {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-sm sm:text-base text-primary whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer: total + payment + shipping */}
                  <footer
                    className={`px-5 py-4 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm ${
                      isLight ? 'bg-[#FBF7F1]/60' : 'bg-background/40'
                    }`}
                  >
                    <div>
                      <p className="text-muted-foreground flex items-center gap-1.5">
                        <CreditCard size={12} /> Payment
                      </p>
                      <p className="font-mono text-[11px] sm:text-xs mt-0.5 truncate">
                        {order.paymentId || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground flex items-center gap-1.5">
                        <MapPin size={12} /> Shipping to
                      </p>
                      <p className="mt-0.5 truncate">
                        {order.customer.name} · {order.customer.city}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-muted-foreground">Total paid</p>
                      <p className="font-heading text-base sm:text-lg font-bold text-primary">
                        {formatPrice(order.amount)}
                      </p>
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>
        )}

        {/* Support footer */}
        <div className="glass-card rounded-2xl p-5 mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help with an order? Message us on{' '}
            <a
              href="https://wa.me/917039382706"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WhatsApp
            </a>{' '}
            or email{' '}
            <a
              href="mailto:contact@tubhyam.com"
              className="text-primary hover:underline"
            >
              contact@tubhyam.com
            </a>
            .
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
