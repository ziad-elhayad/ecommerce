// services/api/auth.ts

import apiClient, { publicApiClient } from './config';
import { User } from '@/types';

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
  user?: User;
}

function extractAuthPayload(raw: unknown): AuthResponse {
  if (!raw || typeof raw !== 'object') return {};
  const o = raw as Record<string, unknown>;
  if (o.token || o.user) return raw as AuthResponse;
  if (o.data && typeof o.data === 'object') {
    const d = (o.data as Record<string, unknown>);
    return { token: d.token as string, user: d.user as User };
  }
  return {};
}

function getLoginErrorMessage(error: any): string {
  const d = error.response?.data;
  if (!d || typeof d !== 'object') return 'البريد أو كلمة المرور غير صحيحة. حاول مرة أخرى.';
  if (typeof d.message === 'string' && d.message) return d.message;
  const arr = d.errors;
  if (Array.isArray(arr) && arr.length) return (arr[0].msg ?? arr[0].message) || 'البريد أو كلمة المرور غير صحيحة.';
  if (error.response?.status === 401) return 'البريد أو كلمة المرور غير صحيحة.';
  return 'فشل تسجيل الدخول. حاول مرة أخرى.';
}

function getRegisterErrorMessage(error: any): string {
  const d = error.response?.data;
  if (!d || typeof d !== 'object') return 'فشل إنشاء الحساب. تأكد من البيانات وحاول مرة أخرى.';
  if (typeof d.message === 'string' && d.message) return d.message;
  const arr = d.errors;
  if (Array.isArray(arr) && arr.length) {
    return arr.map((e: any) => e.msg ?? e.message).filter(Boolean).join('. ') || 'بيانات غير صالحة.';
  }
  if (error.response?.status === 409) return 'هذا البريد الإلكتروني أو رقم الهاتف مسجل بالفعل. حاول تسجيل الدخول.';
  if (error.response?.status === 400) return 'بيانات غير صالحة. تأكد من البريد وكلمة المرور ورقم الهاتف.';
  return 'فشل إنشاء الحساب. حاول مرة أخرى.';
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Use publicApiClient for login to ensure no invalid token is sent
      const response = await publicApiClient.post<AuthResponse>('/auth/signin', credentials);
      const payload = extractAuthPayload(response.data);
      const token = payload.token;
      if (token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user));
        }
        return payload;
      }
      throw new Error('لم يُرجَع رمز دخول من الخادم.');
    } catch (error: any) {
      throw new Error(getLoginErrorMessage(error));
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const cleanedData = {
        ...data,
        phone: String(data.phone).trim(),
      };

      // Use publicApiClient for signup
      const response = await publicApiClient.post<AuthResponse>('/auth/signup', cleanedData);
      const payload = extractAuthPayload(response.data);
      if (payload.token && typeof window !== 'undefined') {
        localStorage.setItem('token', payload.token);
        if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user));
      }
      return payload;
    } catch (error: any) {
      throw new Error(getRegisterErrorMessage(error));
    }
  },

  // Forgot Password
  forgotPassword: async (data: { email: string }): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post('/auth/forgotPasswords', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset code';
      throw new Error(message);
    }
  },

  // Verify Reset Code
  verifyResetCode: async (data: { resetCode: string }): Promise<{ status: string }> => {
    try {
      const response = await apiClient.post('/auth/verifyResetCode', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid reset code';
      throw new Error(message);
    }
  },

  // Reset Password
  resetPassword: async (data: { email: string; newPassword: string }): Promise<{ token: string }> => {
    try {
      const response = await apiClient.put('/auth/resetPassword', data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password';
      throw new Error(message);
    }
  },

  // Get Current User
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check Authentication
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
