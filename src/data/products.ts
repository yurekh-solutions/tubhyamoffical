import { api } from '@/config/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'formal' | 'jeans' | 'track';
  image: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  material: string;
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const categories = [
  { id: 'formal', name: 'Formal Pants', description: 'Elegant office & occasion wear' },
  { id: 'jeans', name: 'Jeans', description: 'Classic denim styles' },
  { id: 'track', name: 'Track Pants', description: 'Athleisure comfort' },
] as const;

export const getProductsByCategory = async (category: Product['category']) => {
  const data = await api.get<{success: boolean; products: Product[]; totalCount: number}>(`/products/category/${category}`);
  return data.products || [];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const data = await api.get<{success: boolean; product: Product}>(`/products/${id}`);
    return data.product || null;
  } catch {
    return null;
  }
};

export const getBestSellers = async (): Promise<Product[]> => {
  const data = await api.get<{success: boolean; products: Product[]}>(`/products/featured/bestsellers`);
  return data.products || [];
};

export const getNewArrivals = async (): Promise<Product[]> => {
  const data = await api.get<{success: boolean; products: Product[]}>(`/products/featured/new-arrivals`);
  return data.products || [];
};
