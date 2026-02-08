// src/utils/helpers.ts

import { Product } from '@/src/types/product.types';

export const getProductId = (product: Product): string => {
  return product._id || product.id || '';
};

export const getProductImage = (product: Product): string => {
  return product.imageCover || product.image || product.images?.[0] || '/placeholder.jpg';
};

export const getCategoryName = (category: any): string => {
  return typeof category === 'object' ? category?.name || 'Unknown' : category || 'Unknown';
};

export const getCategoryId = (category: any): string => {
  return typeof category === 'object' ? category?._id || '' : category || '';
};

export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} EGP`;
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(010|011|012|015)\d{8}$/;
  return phoneRegex.test(phone);
};
