import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

export interface OrderHistoryItem {
  id: string;               // Razorpay order_id (preferred) or TBHM-<ts>
  paymentId?: string;       // Razorpay payment_id
  amount: number;           // total paid in INR
  currency?: string;        // INR by default
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;        // ISO date
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }>;
}

interface OrderHistoryContextType {
  orders: OrderHistoryItem[];
  addOrder: (order: OrderHistoryItem) => void;
  clearOrders: () => void;
}

const STORAGE_KEY = 'tubhyam_orders_v1';
const MAX_ORDERS = 50;

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(
  undefined,
);

export const OrderHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);

  // Hydrate from localStorage on mount (runs once, on the client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as OrderHistoryItem[];
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      }
    } catch (err) {
      console.warn('OrderHistory: failed to hydrate from localStorage', err);
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.warn('OrderHistory: failed to persist', err);
    }
  }, [orders]);

  const addOrder = useCallback((order: OrderHistoryItem) => {
    setOrders((prev) => {
      // De-duplicate by id (Razorpay may invoke the handler twice).
      const exists = prev.some((o) => o.id === order.id);
      if (exists) return prev;
      const next = [order, ...prev];
      return next.slice(0, MAX_ORDERS);
    });
  }, []);

  const clearOrders = useCallback(() => {
    setOrders([]);
  }, []);

  return (
    <OrderHistoryContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};

export const useOrderHistory = () => {
  const ctx = useContext(OrderHistoryContext);
  if (!ctx) {
    throw new Error('useOrderHistory must be used within OrderHistoryProvider');
  }
  return ctx;
};
