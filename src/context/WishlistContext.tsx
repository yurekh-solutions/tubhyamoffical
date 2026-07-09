import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { toast } from 'sonner';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('tubhyam_wishlist_v1');
      if (stored) return JSON.parse(stored) as Product[];
    } catch (err) {
      console.warn('WishlistContext: failed to hydrate from localStorage', err);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('tubhyam_wishlist_v1', JSON.stringify(items));
    } catch (err) {
      console.warn('WishlistContext: failed to persist to localStorage', err);
    }
  }, [items]);

  const addToWishlist = useCallback((product: Product) => {
    setItems(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
    toast.success('Added to Wishlist', { description: product.name });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId));
    toast.success('Removed from Wishlist');
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setItems(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        toast.success('Removed from Wishlist');
        return prev.filter(p => p.id !== product.id);
      }
      toast.success('Added to Wishlist', { description: product.name });
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(p => p.id === productId);
  }, [items]);

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      totalItems: items.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
