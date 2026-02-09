// lib/utils/helpers.ts

import { STORAGE_KEYS } from './constants';

// Storage helpers
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

// Auth helpers
export const auth = {
  getToken: (): string | null => storage.get<string>(STORAGE_KEYS.TOKEN),
  setToken: (token: string): void => storage.set(STORAGE_KEYS.TOKEN, token),
  removeToken: (): void => storage.remove(STORAGE_KEYS.TOKEN),
  isAuthenticated: (): boolean => !!auth.getToken(),
};

// Product helpers
export const getProductId = (product: any): string => {
  return product?._id || product?.id || '';
};

export const getProductImage = (product: any): string => {
  return product?.imageCover || product?.image || product?.images?.[0] || '/placeholder.jpg';
};

export const getCategoryName = (category: any): string => {
  return typeof category === 'object' ? category?.name || 'Unknown' : category || 'Unknown';
};

export const getCategoryId = (category: any): string => {
  return typeof category === 'object' ? category?._id || '' : category || '';
};

// Price formatting
export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} EGP`;
};

// Date formatting
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Delay helper (for debouncing)
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Safe JSON parse
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

// Debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Truncate text
export const truncate = (text: string, length: number): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};
