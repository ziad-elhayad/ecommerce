// services/api/products.ts

import apiClient from './config';
import { Product } from '@/types';

interface ProductsResponse {
  results: number;
  metadata: {
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

interface CategoriesResponse {
  results: number;
  data: Array<{
    _id: string;
    name: string;
    slug: string;
    image: string;
  }>;
}

export const productsApi = {
  getAll: async (limit?: number): Promise<Product[]> => {
    const url = limit ? `/products?limit=${limit}` : '/products';
    const response = await apiClient.get<ProductsResponse>(url);
    // Map _id to id for compatibility
    return response.data.data.map(product => ({
      ...product,
      id: product._id
    }));
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<SingleProductResponse>(`/products/${id}`);
    return {
      ...response.data.data,
      id: response.data.data._id
    };
  },

  getByCategory: async (categoryId: string): Promise<Product[]> => {
    const response = await apiClient.get<ProductsResponse>(`/products?category=${categoryId}`);
    return response.data.data.map(product => ({
      ...product,
      id: product._id
    }));
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<CategoriesResponse>('/categories');
    return response.data.data.map(cat => cat.name);
  },

  getCategoriesDetailed: async () => {
    const response = await apiClient.get<CategoriesResponse>('/categories');
    return response.data.data;
  },

  getAllSorted: async (sort: 'asc' | 'desc' = 'desc'): Promise<Product[]> => {
    const response = await apiClient.get<ProductsResponse>(`/products?sort=${sort}`);
    return response.data.data.map(product => ({
      ...product,
      id: product._id
    }));
  },
};
