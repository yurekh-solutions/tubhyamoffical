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

  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Static-first: products appear instantly. The backend is consulted in the
  // background to refresh stock, but we NEVER let the backend override the
  // curated static catalog. When a backend product's ID matches a static
  // product, we keep the static version (which carries captions, colorImages,
  // descriptions, badges, etc.). Backend-only products (not in the catalog)
  // are ignored, preventing stale MongoDB entries (removed/merged products)
  // from reappearing on the shop page.
  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        const data = await api.get<{ success: boolean; products: Product[] }>('/products');
        if (cancelled || !data.products || data.products.length === 0) return;

        // Build set of known static IDs for O(1) lookup (case-insensitive
        // because the backend inventory returns uppercase SKUs like 'FP-017'
        // while the curated catalog uses lowercase 'fp-017').

        // Start with curated static products as the source of truth.
        // Optionally merge live stock/status flags from the backend when
        // the backend returns a product whose SKU matches a static one.
        const merged: Product[] = staticProducts.map(staticP => {
          // Backend may key by SKU (uppercase) — normalize.
          const backendVersion = data.products.find(
            p => p.id.toLowerCase() === staticP.id.toLowerCase()
          );
          if (!backendVersion) return staticP;
          // Merge live stock flag only (keeps curated captions, colors, etc.)
          return {
            ...staticP,
            inStock: backendVersion.inStock ?? staticP.inStock,
          };
        });

        setAllProducts(merged);
      } catch {
        // Static products already displayed — no action needed
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Exclude test/placeholder products (price <= 1)
    filtered = filtered.filter(p => p.price > 1);

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
