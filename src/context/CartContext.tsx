import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { toast } from 'sonner';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  lastAddedItem: CartItem | null;
  isAddToBagSheetOpen: boolean;
  setIsAddToBagSheetOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Hydrate cart from localStorage on mount so items survive hard refresh.
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('tubhyam_cart_v1');
      if (stored) return JSON.parse(stored) as CartItem[];
    } catch (err) {
      console.warn('CartContext: failed to hydrate cart from localStorage', err);
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [isAddToBagSheetOpen, setIsAddToBagSheetOpen] = useState(false);

  // Persist cart to localStorage whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem('tubhyam_cart_v1', JSON.stringify(items));
    } catch (err) {
      console.warn('CartContext: failed to persist cart to localStorage', err);
    }
  }, [items]);

  const addToCart = useCallback((product: Product, size: string, color: string) => {
    // Skip test products with price <= 1
    if (product.price <= 1) {
      toast.error('This product is not available for purchase');
      return;
    }

    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.size === size && item.color === color
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        setLastAddedItem({ ...updated[existingIndex] });
        return updated;
      }

      const newItem: CartItem = { product, quantity: 1, size, color };
      setLastAddedItem(newItem);
      return [...prev, newItem];
    });

    // Show bottom sheet instead of opening cart directly
    setIsAddToBagSheetOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.size === size && item.color === color)
    ));
    toast.success('Item removed from cart');
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.product.id === productId && item.size === size && item.color === color) {
        return { ...item, quantity };
      }
      return item;
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.success('Cart cleared');
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
      lastAddedItem,
      isAddToBagSheetOpen,
      setIsAddToBagSheetOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
