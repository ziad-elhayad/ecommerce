// src/services/storage/localStorage.service.ts

import { STORAGE_KEYS } from '@/src/utils/constants';
import { User, AuthTokens } from '@/src/types/user.types';

class LocalStorageService {
  // Generic methods
  private getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  }

  private removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  // Auth tokens
  getAccessToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  setAccessToken(token: string): void {
    this.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): void {
    this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  setTokens(tokens: AuthTokens): void {
    this.setAccessToken(tokens.accessToken);
    if (tokens.refreshToken) {
      this.setRefreshToken(tokens.refreshToken);
    }
  }

  clearTokens(): void {
    this.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // User data
  getUser(): User | null {
    return this.getItem<User>(STORAGE_KEYS.USER);
  }

  setUser(user: User): void {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  clearUser(): void {
    this.removeItem(STORAGE_KEYS.USER);
  }

  // Cart
  getCart<T>(): T | null {
    return this.getItem<T>(STORAGE_KEYS.CART);
  }

  setCart<T>(cart: T): void {
    this.setItem(STORAGE_KEYS.CART, cart);
  }

  clearCart(): void {
    this.removeItem(STORAGE_KEYS.CART);
  }

  // Wishlist
  getWishlist<T>(): T | null {
    return this.getItem<T>(STORAGE_KEYS.WISHLIST);
  }

  setWishlist<T>(wishlist: T): void {
    this.setItem(STORAGE_KEYS.WISHLIST, wishlist);
  }

  clearWishlist(): void {
    this.removeItem(STORAGE_KEYS.WISHLIST);
  }

  // Clear all
  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }
}

export const storageService = new LocalStorageService();
