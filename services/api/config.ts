// services/api/config.ts
// Route E-commerce API: https://ecommerce.routemisr.com/api/v1
// Docs: https://documenter.getpostman.com/view/5709532/2s93JqTRWN

import axios from 'axios';

export const API_BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (only in browser)
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      // Only send token for NON-public endpoints ensures we don't accidentally leak it
      // But we will primarily use publicApiClient for public data now.
      if (token) {
        config.headers.token = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: clear auth on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      console.warn('Unauthorized access (401). Clearing token.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't reload - let the page handle the error gracefully
    }
    return Promise.reject(error);
  }
);

// Dedicated Client for Public Data (Products, Categories)
// This client NEVER sends a token, preventing 500/Timeout errors caused by expired guest tokens.
export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000, // Increased timeout to 25s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add retry logic to publicApiClient to handle server instability (Pool destroyed, etc.)
publicApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // If we have no config, just reject
    if (!config) return Promise.reject(error);

    // Initialize retry count
    config._retryCount = config._retryCount || 0;

    // Retry conditions: 500-range errors or Network Errors
    const shouldRetry =
      config._retryCount < 3 &&
      (error.code === 'ECONNABORTED' || (error.response?.status && error.response.status >= 500));

    if (shouldRetry) {
      config._retryCount += 1;

      // Exponential backoff: 1s, 2s, 4s
      const delay = 1000 * Math.pow(2, config._retryCount - 1);

      console.warn(`Public API Error (${error.message}). Retrying in ${delay}ms... (Attempt ${config._retryCount}/3)`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return publicApiClient(config);
    }

    return Promise.reject(error);
  }
);


export default apiClient;
