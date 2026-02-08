// lib/api/products.ts

import apiClient, { handleApiError } from './client';
import { API_ENDPOINTS } from '@/lib/utils/constants';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCached = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
};

const setCache = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const productsApi = {
  async getAll(limit?: number): Promise<any[]> {
    try {
      const cacheKey = `products-${limit || 'all'}`;
      const cached = getCached<any[]>(cacheKey);
      if (cached) return cached;
      
      const url = limit ? `${API_ENDPOINTS.PRODUCTS}?limit=${limit}` : API_ENDPOINTS.PRODUCTS;
      const { data } = await apiClient.get(url);
      
      const products = data.data || [];
      setCache(cacheKey, products);
      
      return products;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getById(id: string): Promise<any> {
    try {
      const cacheKey = `product-${id}`;
      const cached = getCached<any>(cacheKey);
      if (cached) return cached;
      
      const { data } = await apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
      
      const product = data.data;
      setCache(cacheKey, product);
      
      return product;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getCategories(): Promise<any[]> {
    try {
      const cacheKey = 'categories';
      const cached = getCached<any[]>(cacheKey);
      if (cached) return cached;
      
      const { data } = await apiClient.get(API_ENDPOINTS.CATEGORIES);
      
      const categories = data.data || [];
      setCache(cacheKey, categories);
      
      return categories;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getCategoryById(id: string): Promise<any> {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
      return data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getByCategory(categoryId: string): Promise<any[]> {
    try {
      const allProducts = await this.getAll();
      return allProducts.filter((product) => {
        const prodCatId = typeof product.category === 'object' 
          ? product.category._id 
          : product.category;
        return prodCatId === categoryId;
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getBrands(): Promise<any[]> {
    try {
      const cacheKey = 'brands';
      const cached = getCached<any[]>(cacheKey);
      if (cached) return cached;
      
      const { data } = await apiClient.get(API_ENDPOINTS.BRANDS);
      
      const brands = data.data || [];
      setCache(cacheKey, brands);
      
      return brands;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getBrandById(id: string): Promise<any> {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.BRAND_BY_ID(id));
      return data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getByBrand(brandId: string): Promise<any[]> {
    try {
      const allProducts = await this.getAll();
      return allProducts.filter((product) => {
        return product.brand?._id === brandId;
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  clearCache(): void {
    cache.clear();
  },
};
