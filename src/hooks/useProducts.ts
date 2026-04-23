import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/data/products';
import { api } from '@/config/api';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name-asc';

interface UseProductsOptions {
  category?: Product['category'] | 'all';
  searchQuery?: string;
  sortBy?: SortOption;
  priceRange?: [number, number];
}

interface ProductsApiResponse {
  success: boolean;
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { 
    category = 'all', 
    searchQuery = '', 
    sortBy = 'featured',
    priceRange = [0, 10000]
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params
        const params = new URLSearchParams();
        if (category !== 'all') params.append('category', category);
        if (searchQuery) params.append('search', searchQuery);
        if (sortBy) params.append('sortBy', sortBy);
        params.append('minPrice', priceRange[0].toString());
        params.append('maxPrice', priceRange[1].toString());

        const queryString = params.toString() ? `?${params.toString()}` : '';
        const data = await api.get<ProductsApiResponse>(`/products${queryString}`);

        if (data.success) {
          setProducts(data.products);
          setTotalCount(data.totalCount);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        // Fallback to empty array on error
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery, sortBy, priceRange[0], priceRange[1]]);

  return {
    products,
    totalCount,
    loading,
    error,
  };
};
