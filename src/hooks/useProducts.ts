import { useState, useMemo } from 'react';
import { Product, products } from '@/data/products';

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

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

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
  }, [category, searchQuery, sortBy, priceRange]);

  return {
    products: filteredProducts,
    totalCount: filteredProducts.length,
  };
};
