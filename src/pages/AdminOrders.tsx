import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Filter, Eye, Truck, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import { api } from '@/config/api';
import { toast } from 'sonner';

interface Order {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  shippingStatus: string;
  awbCode?: string;
  shipmentId?: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch from inventory app orders endpoint
      const response = await api.get('/orders');
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const createShipment = async (order: Order) => {
    try {
      toast.loading('Creating shipment...');
      const response = await api.post(`/orders/${order.id}/ship`, {
        customerInfo: order.customerInfo,
        items: order.items,
        amount: order.amount,
        paymentMode: 'upi',
      });

      if (response.data.success) {
        toast.success(`Shipment created! AWB: ${response.data.awb_code}`);
        fetchOrders(); // Refresh
      } else {
        toast.error(response.data.message || 'Failed to create shipment');
      }
    } catch (error) {
      toast.error('Failed to create shipment');
    }
  };

  const trackShipment = async (awbCode: string) => {
    try {
      const response = await api.get(`/orders/track?awb=${awbCode}`);
      if (response.data.success) {
        setSelectedOrder({
          ...selectedOrder!,
          shippingStatus: response.data.tracking?.shipment_status || 'unknown',
        });
      }
    } catch (error) {
      toast.error('Failed to track shipment');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'shipped':
        return <Truck size={16} className="text-blue-500" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo?.phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || order.shippingStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-semibold">Order Management</h1>
            <p className="text-muted-foreground mt-1">Manage and track all customer orders</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/seo')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <FileText size={18} />
              SEO Content
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Back to Admin
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-xl mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Order ID, Name, or Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">AWB</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs">{order.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-sm">{order.customerInfo?.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{order.customerInfo?.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">{formatPrice(order.amount)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.shippingStatus || order.status)}`}>
                          {getStatusIcon(order.shippingStatus || order.status)}
                          <span className="capitalize">{order.shippingStatus || order.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {order.awbCode ? (
                          <span className="font-mono text-xs">{order.awbCode}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {!order.awbCode && order.status !== 'cancelled' && (
                            <button
                              onClick={() => createShipment(order)}
                              className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                              title="Create Shipment"
                            >
                              <Truck size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-semibold">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment ID</p>
                    <p className="font-mono text-xs">{selectedOrder.paymentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-semibold">{formatPrice(selectedOrder.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.shippingStatus || selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.shippingStatus || selectedOrder.status)}
                      <span className="capitalize">{selectedOrder.shippingStatus || selectedOrder.status}</span>
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-medium text-sm mb-2">Customer Information</h3>
                  <div className="bg-secondary/30 rounded-lg p-4 space-y-1">
                    <p className="font-medium">{selectedOrder.customerInfo?.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customerInfo?.phone}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customerInfo?.email}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedOrder.customerInfo?.address}<br />
                      {selectedOrder.customerInfo?.city}, {selectedOrder.customerInfo?.state} - {selectedOrder.customerInfo?.pincode}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-medium text-sm mb-2">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-secondary/30 rounded-lg p-3">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {item.sku} | Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Info */}
                {selectedOrder.awbCode && (
                  <div>
                    <h3 className="font-medium text-sm mb-2">Shipping Information</h3>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">AWB Code</p>
                          <p className="font-mono font-semibold">{selectedOrder.awbCode}</p>
                        </div>
                        {selectedOrder.shipmentId && (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Shipment ID</p>
                            <p className="font-mono text-xs">{selectedOrder.shipmentId}</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => trackShipment(selectedOrder.awbCode!)}
                        className="mt-3 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        Track Shipment
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  {!selectedOrder.awbCode && selectedOrder.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        createShipment(selectedOrder);
                        setSelectedOrder(null);
                      }}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Truck size={16} />
                      Create Shipment
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
