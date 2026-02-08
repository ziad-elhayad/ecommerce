// services/api/wishlist.ts

import apiClient from './config';
import { Product } from '@/types';

export interface WishlistResponse {
  status: string;
  count: number;
  data: string[]; // Array of product IDs
}

export const wishlistApi = {
  // Get wishlist
  getWishlist: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<WishlistResponse>('/wishlist');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Get wishlist error:', error);
      // Return empty array if not found
      if (error.response?.status === 404) {
        return [];
      }
      throw new Error(error.response?.data?.message || 'Failed to get wishlist');
    }
  },

  // Add to wishlist
  addToWishlist: async (productId: string): Promise<string[]> => {
    try {
      const response = await apiClient.post<WishlistResponse>('/wishlist', { productId });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Add to wishlist error:', error);
      throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (productId: string): Promise<string[]> => {
    try {
      const response = await apiClient.delete<WishlistResponse>(`/wishlist/${productId}`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Remove from wishlist error:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  },

  // Check if product is in wishlist
  isInWishlist: async (productId: string): Promise<boolean> => {
    try {
      const wishlist = await wishlistApi.getWishlist();
      return wishlist.includes(productId);
    } catch (error) {
      return false;
    }
  }
};
