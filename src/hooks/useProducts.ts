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

  // Fetch products on mount
  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.get<{ success: boolean; products: Product[] }>('/products');
        if (!cancelled) {
          setAllProducts(data.products || []);
        }
      } catch {
        if (!cancelled) {
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

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
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
