// services/api/reviews.ts

import apiClient from './config';

export interface Review {
  _id: string;
  title: string;
  ratings: number;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  results: number;
  data: Review[];
}

export const reviewsApi = {
  // الحصول على مراجعات منتج
  getProductReviews: async (productId: string): Promise<Review[]> => {
    try {
      const response = await apiClient.get<ReviewsResponse>(
        `/products/${productId}/reviews`
      );
      return response.data.data || [];
    } catch (error: any) {
      console.error('Get reviews error:', error);
      throw new Error(error.response?.data?.message || 'فشل جلب المراجعات');
    }
  },

  // إضافة مراجعة
  addReview: async (data: {
    title: string;
    ratings: number;
    product: string;
  }): Promise<Review> => {
    try {
      const response = await apiClient.post<{ data: Review }>('/reviews', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Add review error:', error);
      throw new Error(error.response?.data?.message || 'فشل إضافة المراجعة');
    }
  },

  // تحديث مراجعة
  updateReview: async (
    reviewId: string,
    data: { title?: string; ratings?: number }
  ): Promise<Review> => {
    try {
      const response = await apiClient.put<{ data: Review }>(
        `/reviews/${reviewId}`,
        data
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Update review error:', error);
      throw new Error(error.response?.data?.message || 'فشل تحديث المراجعة');
    }
  },

  // حذف مراجعة
  deleteReview: async (reviewId: string): Promise<void> => {
    try {
      await apiClient.delete(`/reviews/${reviewId}`);
    } catch (error: any) {
      console.error('Delete review error:', error);
      throw new Error(error.response?.data?.message || 'فشل حذف المراجعة');
    }
  },
};
