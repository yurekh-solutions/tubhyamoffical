import { useState, useMemo, useEffect } from 'react';
import { Product, products as staticProducts } from '@/data/products';
import { api } from '@/config/api';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name-asc';

interface UseProductsOptions {
  category?: Product['category'] | 'all';
  searchQuery?: string;
  sortBy?: SortOption;
  priceRange?: [number, number];
}

// Cache configuration
const CACHE_KEY = 'tubhyam_products_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface ProductCache {
  products: Product[];
  timestamp: number;
}

// Cache helper functions
const getCache = (): ProductCache | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
};

const setCache = (products: Product[]): void => {
  try {
    const cache: ProductCache = {
      products,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to cache products:', error);
  }
};

export const clearProductCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear product cache:', error);
  }
};

export const useProducts = (options: UseProductsOptions = {}) => {
  const {
    category = 'all',
    searchQuery = '',
    sortBy = 'featured',
    priceRange = [0, 10000]
  } = options;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on mount with stale-while-revalidate
  useEffect(() => {
    let cancelled = false;
    
    const fetchProducts = async () => {
      setError(null);
      
      // Check cache first
      const cached = getCache();
      const cacheAge = cached ? Date.now() - cached.timestamp : Infinity;
      
      if (cached && cached.products.length > 0) {
        // Show cached data immediately
        setAllProducts(cached.products);
        setIsLoading(false);
        
        // If cache is fresh (< 5 min), we're done
        if (cacheAge < CACHE_TTL) {
          return;
        }
        // Cache is stale - continue to refresh in background
      } else {
        // No cache - show loading
        setIsLoading(true);
      }
      
      // Fetch fresh data from API
      try {
        const data = await api.get<{ success: boolean; products: Product[] }>('/products');
        if (!cancelled) {
          const products = data.products && data.products.length > 0 
            ? data.products 
            : staticProducts;
          
          setAllProducts(products);
          setCache(products); // Save to localStorage
        }
      } catch {
        if (!cancelled && !cached) {
          // On error with no cache, fall back to static products
          setAllProducts(staticProducts);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    
    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Debug: log category values
    if (category !== 'all' && allProducts.length > 0) {
      const uniqueCats = [...new Set(allProducts.map(p => p.category))];
      console.log('[useProducts] Filtering by category:', category, '| Available categories:', uniqueCats, '| Total products:', allProducts.length);
    }

    // Filter by category (case-insensitive, partial match)
    if (category !== 'all') {
      filtered = filtered.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const filterCat = category.toLowerCase();
        return pCat === filterCat || pCat.includes(filterCat) || filterCat.includes(pCat);
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    return filtered;
  }, [allProducts, category, searchQuery, sortBy, priceRange]);

  return {
    products: filteredProducts,
    totalCount: filteredProducts.length,
    isLoading,
    error,
  };
};
