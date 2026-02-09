// lib/utils/constants.ts

export const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/signin',
  REGISTER: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgotPasswords',
  VERIFY_RESET_CODE: '/auth/verifyResetCode',
  RESET_PASSWORD: '/auth/resetPassword',

  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,

  // Brands
  BRANDS: '/brands',
  BRAND_BY_ID: (id: string) => `/brands/${id}`,

  // Cart
  CART: '/cart',
  CART_ITEM: (id: string) => `/cart/${id}`,
  APPLY_COUPON: '/cart/applyCoupon',

  // Wishlist
  WISHLIST: '/wishlist',
  WISHLIST_ITEM: (id: string) => `/wishlist/${id}`,

  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  CHECKOUT_SESSION: (cartId: string) => `/orders/checkout-session/${cartId}`,

  // Reviews
  REVIEWS: '/reviews',
  PRODUCT_REVIEWS: (productId: string) => `/products/${productId}/reviews`,
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart-storage',
  WISHLIST: 'wishlist-storage',
} as const;

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (id: string) => `/categories/${id}`,
  BRANDS: '/brands',
  BRAND_DETAIL: (id: string) => `/brands/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
} as const;

export const MESSAGES = {
  SUCCESS: {
    ADDED_TO_CART: 'Product added to cart',
    REMOVED_FROM_CART: 'Product removed from cart',
    ADDED_TO_WISHLIST: 'Added to wishlist',
    REMOVED_FROM_WISHLIST: 'Removed from wishlist',
    ORDER_PLACED: 'Order placed successfully',
    REGISTRATION_SUCCESS: 'Registration successful! Please sign in.',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please sign in to continue.',
    NOT_FOUND: 'Resource not found.',
  },
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_PATTERN: /^(010|011|012|015)\d{8}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
