// src/types/user.types.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

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
  token: string;
  refreshToken?: string;
  user: User;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}
