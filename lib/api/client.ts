// lib/api/client.ts

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/lib/utils/constants';
import { storage, auth } from '@/lib/utils/helpers';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = auth.getToken();

    if (token && config.headers) {
      config.headers.token = token;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      auth.removeToken();
      storage.remove(STORAGE_KEYS.USER);

      if (typeof window !== 'undefined') {
        console.warn('Session expired. Please login again.');
        // window.location.href = '/login?session=expired'; // Removed to prevent infinite loop
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Generic API error handler
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (message) return message;

    if (error.response?.status === 400) return 'Invalid request data';
    if (error.response?.status === 401) return 'Unauthorized. Please sign in.';
    if (error.response?.status === 403) return 'Access forbidden';
    if (error.response?.status === 404) return 'Resource not found';
    if (error.response?.status === 409) return 'Resource already exists';
    if (error.response?.status === 500) return 'Server error. Please try again later.';

    if (error.code === 'ECONNABORTED') return 'Request timeout';
    if (error.code === 'ERR_NETWORK') return 'Network error';
  }

  return 'An unexpected error occurred';
};
