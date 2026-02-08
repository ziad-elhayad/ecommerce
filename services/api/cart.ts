// services/api/cart.ts

import apiClient from './config';
import { Product } from '@/types';

export interface CartProduct {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartProduct[];
  totalCartPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: CartData;
}

function extractCartData(raw: unknown): CartData | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  let cart: Record<string, unknown> | null = null;

  // Try to find the cart object in different places
  if (o.data && typeof o.data === 'object') {
    cart = o.data as Record<string, unknown>;
  } else if (o.cartId) {
    // Sometimes response is just { cartId, ... } but we need the full object.
    // If we can't find it, we might return what we have if it looks like a cart
    cart = o;
  } else if (o._id) {
    cart = o;
  }

  if (!cart) return null;
  const id = (cart._id as string) || (cart.cartId as string) || (o.cartId as string);
  if (!id) return null;

  // Ensure products array exists
  const products = Array.isArray(cart.products) ? cart.products : [];

  return { ...cart, _id: id, products } as CartData;
}

export const cartApi = {
  getCart: async (): Promise<CartData | null> => {
    try {
      const response = await apiClient.get<CartResponse | CartData>('/cart');
      const cart = extractCartData(response.data);
      return cart && cart._id ? cart : null;
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 401) return null;
      console.error('Get cart error:', error);
      throw new Error(error.response?.data?.message || 'فشل جلب السلة');
    }
  },

  addToCart: async (productId: string): Promise<CartData> => {
    try {
      const response = await apiClient.post<CartResponse | CartData>('/cart', { productId });
      const cart = extractCartData(response.data);
      if (!cart) throw new Error('Invalid cart response');
      return cart;
    } catch (error: any) {
      console.error('Add to cart error:', error);
      throw new Error(error.response?.data?.message || 'فشل إضافة المنتج للسلة');
    }
  },

  updateCartItemQuantity: async (
    itemId: string,
    count: number
  ): Promise<CartData> => {
    try {
      const response = await apiClient.put<CartResponse | CartData>(`/cart/${itemId}`, { count });
      const cart = extractCartData(response.data);
      if (!cart) throw new Error('Invalid cart response');
      return cart;
    } catch (error: any) {
      console.error('Update cart item error:', error);
      throw new Error(error.response?.data?.message || 'فشل تحديث الكمية');
    }
  },

  // حذف منتج من السلة
  removeFromCart: async (itemId: string): Promise<CartData> => {
    try {
      const response = await apiClient.delete<CartResponse>(`/cart/${itemId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Remove from cart error:', error);
      throw new Error(error.response?.data?.message || 'فشل حذف المنتج من السلة');
    }
  },

  // مسح السلة بالكامل
  clearCart: async (): Promise<void> => {
    try {
      await apiClient.delete('/cart');
    } catch (error: any) {
      console.error('Clear cart error:', error);
      throw new Error(error.response?.data?.message || 'فشل مسح السلة');
    }
  },

  // تطبيق كوبون خصم
  applyCoupon: async (couponName: string): Promise<CartData> => {
    try {
      const response = await apiClient.put<CartResponse>('/cart/applyCoupon', {
        coupon: couponName,
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Apply coupon error:', error);
      throw new Error(error.response?.data?.message || 'فشل تطبيق الكوبون');
    }
  },
};
