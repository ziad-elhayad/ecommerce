// src/utils/constants.ts

export const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist',
} as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/signin',
  REGISTER: '/auth/signup',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgotPasswords',
  VERIFY_RESET_CODE: '/auth/verifyResetCode',
  RESET_PASSWORD: '/auth/resetPassword',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (id: string) => `/categories/${id}`,
  
  // Brands
  BRANDS: '/brands',
  BRAND_DETAIL: (id: string) => `/brands/${id}`,
  
  // Cart
  CART: '/cart',
  CART_ITEM: (itemId: string) => `/cart/${itemId}`,
  
  // Wishlist
  WISHLIST: '/wishlist',
  WISHLIST_ITEM: (productId: string) => `/wishlist/${productId}`,
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: (orderId: string) => `/orders/${orderId}`,
  CHECKOUT_SESSION: (cartId: string) => `/orders/checkout-session/${cartId}`,
} as const;

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CATEGORIES: '/categories',
  BRANDS: '/brands',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_PATTERN: /^(010|011|012|015)\d{8}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const CACHE_DURATION = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 10 * 60 * 1000, // 10 minutes
  BRANDS: 10 * 60 * 1000, // 10 minutes
} as const;
