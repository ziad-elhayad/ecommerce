
import apiClient, { handleApiError } from './client';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/lib/utils/constants';
import { storage, auth } from '@/lib/utils/helpers';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  user?: any;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.LOGIN,
        credentials
      );
      
      if (data.token) {
        auth.setToken(data.token);
        if (data.user) {
          storage.set(STORAGE_KEYS.USER, data.user);
        }
      }
      
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.REGISTER,
        userData
      );
      
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const { data } = await apiClient.post(
        API_ENDPOINTS.FORGOT_PASSWORD,
        { email }
      );
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async verifyResetCode(resetCode: string): Promise<{ status: string }> {
    try {
      const { data } = await apiClient.post(
        API_ENDPOINTS.VERIFY_RESET_CODE,
        { resetCode }
      );
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async resetPassword(email: string, newPassword: string): Promise<{ token: string }> {
    try {
      const { data } = await apiClient.put(
        API_ENDPOINTS.RESET_PASSWORD,
        { email, newPassword }
      );
      
      if (data.token) {
        auth.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  logout(): void {
    auth.removeToken();
    storage.remove(STORAGE_KEYS.USER);
  },

  getCurrentUser(): any | null {
    return storage.get(STORAGE_KEYS.USER);
  },

  isAuthenticated(): boolean {
    return auth.isAuthenticated();
  },
};
