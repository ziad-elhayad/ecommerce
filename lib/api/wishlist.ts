
import apiClient, { handleApiError } from './client';
import { API_ENDPOINTS } from '@/lib/utils/constants';

export const wishlistApi = {
  async getWishlist(): Promise<any[]> {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.WISHLIST);
      return data.data || [];
    } catch (error) {
      // If not found, return empty array
      if ((error as any)?.response?.status === 404) {
        return [];
      }
      throw new Error(handleApiError(error));
    }
  },

  async addToWishlist(productId: string): Promise<any> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.WISHLIST, { productId });
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async removeFromWishlist(productId: string): Promise<any> {
    try {
      const { data } = await apiClient.delete(API_ENDPOINTS.WISHLIST_ITEM(productId));
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
