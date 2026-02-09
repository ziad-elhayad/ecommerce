// src/types/api.types.ts

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
  };
  data: T[];
}

export interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  statusCode?: number;
}

export interface CartItem {
  count: number;
  _id: string;
  product: any;
  price: number;
}

export interface Cart {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  cartItems: any[];
  totalOrderPrice: number;
  paymentMethodType: string;
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
  isPaid: boolean;
  isDelivered: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}
