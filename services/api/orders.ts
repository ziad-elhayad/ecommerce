// services/api/orders.ts

import apiClient from './config';

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface Order {
  _id: string;
  cartItems: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  totalOrderPrice: number;
  paymentMethodType: string;
  shippingAddress: ShippingAddress;
  isPaid: boolean;
  isDelivered: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  results: number;
  data: Order[];
}

export const ordersApi = {
  // Get all orders for user
  getUserOrders: async (): Promise<Order[]> => {
    try {
      console.log('Fetching user orders...');
      const response = await apiClient.get<OrdersResponse>('/orders');
      console.log('Orders response:', response.data);

      // Handle different response structures
      if (Array.isArray(response.data)) return response.data;
      if (response.data && Array.isArray(response.data.data)) return response.data.data;

      return [];
    } catch (error: any) {
      console.error('Get orders error:', error.response?.data || error.message);

      // Return empty array if no orders found (404)
      if (error.response?.status === 404) {
        console.log('No orders found for user');
        return [];
      }

      // If unauthorized, we might want to throw to trigger redirect, or return empty
      if (error.response?.status === 401) {
        console.warn('Unauthorized to get orders');
        return [];
      }

      // For other errors, throw with message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error('Failed to load orders');
    }
  },

  // Get specific order
  getOrderById: async (orderId: string): Promise<Order> => {
    try {
      console.log('Fetching order:', orderId);
      const response = await apiClient.get<{ data: Order }>(`/orders/${orderId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Get order error:', error.response?.data);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error('Failed to load order');
    }
  },

  // Create cash order
  createCashOrder: async (
    cartId: string,
    shippingAddress: ShippingAddress
  ): Promise<Order> => {
    try {
      console.log('Creating cash order for cart:', cartId);
      console.log('Shipping address:', shippingAddress);

      const response = await apiClient.post<{ data: Order }>(
        `/orders/${cartId}`,
        { shippingAddress }
      );

      console.log('Cash order created:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Create cash order error:', error.response?.data);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 400) {
        throw new Error('Invalid order data. Please check your cart and shipping address.');
      }

      throw new Error('Failed to create order');
    }
  },

  // Create online payment session
  createOnlinePaymentSession: async (
    cartId: string,
    shippingAddress: ShippingAddress
  ): Promise<{ session: { url: string } }> => {
    try {
      console.log('Creating payment session for cart:', cartId);

      const response = await apiClient.post(
        `/orders/checkout-session/${cartId}`,
        { shippingAddress }
      );

      console.log('Payment session created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Create payment session error:', error.response?.data);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error('Failed to create payment session');
    }
  },
};
