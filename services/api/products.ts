
import apiClient, { publicApiClient } from './config';
import { Product } from '@/types';

interface ProductsResponse {
  results?: number;
  metadata?: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: Product[];
}

interface SingleProductResponse {
  data: Product;
}

export interface CategoryDetailed {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface CategoriesResponse {
  results?: number;
  metadata?: unknown;
  data: CategoryDetailed[];
}

function extractProductList(raw: unknown): Product[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    if ('data' in raw && Array.isArray((raw as { data: unknown }).data)) {
      return (raw as { data: Product[] }).data;
    }
    // Keep fallback if the API returns { results: [], ... } or similar in future
  }
  return [];
}

function normalizeProduct(p: Product & { _id?: string; id?: string }): Product {
  return {
    ...p,
    id: p._id ?? p.id,
  } as Product;
}

// Simple cache for products (5 minutes)
let productsCache: { data: Product[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

export const productsApi = {
  getAll: async (limit?: number, useCache = true): Promise<Product[]> => {
    try {
      if (useCache && productsCache && Date.now() - productsCache.timestamp < CACHE_DURATION) {
        return limit ? productsCache.data.slice(0, limit) : productsCache.data;
      }

      const url = limit ? `/products?limit=${limit}` : '/products';
      // Use publicApiClient to ensure NO token is sent
      const response = await publicApiClient.get<ProductsResponse | Product[]>(url);
      const raw = response.data;
      const products = extractProductList(raw);
      const normalized = products.map(normalizeProduct);

      if (!limit && normalized.length > 0) {
        productsCache = { data: normalized, timestamp: Date.now() };
      }
      return normalized;
    } catch (error: unknown) {
      console.error('Error fetching products:', error);
      productsCache = null; // Clear cache on error
      throw error;
    }
  },

  getById: async (id: string): Promise<Product | null> => {
    try {
      // Use publicApiClient
      const response = await publicApiClient.get<SingleProductResponse>(`/products/${id}`);
      const raw = response.data;
      const product = (raw && typeof raw === 'object' && 'data' in raw)
        ? (raw as SingleProductResponse).data
        : (Array.isArray(raw) ? raw[0] : raw);
      if (!product) return null;
      return normalizeProduct(product as Product & { _id?: string });
    } catch (error: unknown) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  /** Fetch products by category using API query (GET /products?category=categoryId) */
  getByCategory: async (categoryId: string): Promise<Product[]> => {
    try {
      // Use publicApiClient
      const response = await publicApiClient.get<ProductsResponse>(`/products?category=${categoryId}`);
      const raw = response.data;
      const products = extractProductList(raw);
      return products.map(normalizeProduct);
    } catch (error: unknown) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  getCategories: async (): Promise<string[]> => {
    try {
      const list = await productsApi.getCategoriesDetailed();
      return list.map((cat) => cat.name);
    } catch (error: unknown) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  getCategoriesDetailed: async (): Promise<CategoryDetailed[]> => {
    try {
      // Use publicApiClient
      const response = await publicApiClient.get<CategoriesResponse>('/categories');
      const raw = response.data;
      const data = Array.isArray(raw) ? raw : (raw?.data ?? []);
      return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
      console.error('Error fetching detailed categories:', error);
      return [];
    }
  },

  getAllSorted: async (sort: 'asc' | 'desc' = 'desc'): Promise<Product[]> => {
    try {
      const products = await productsApi.getAll();
      const sorted = [...products].sort((a, b) =>
        sort === 'desc' ? b.price - a.price : a.price - b.price
      );
      return sorted;
    } catch (error: unknown) {
      console.error('Error fetching sorted products:', error);
      return [];
    }
  },

  clearCache: () => {
    productsCache = null;
  },
};

