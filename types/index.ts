// types/index.ts

export interface User {
  id: number;
  email: string;
  username: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address?: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount?: number;
  availableColors?: string[];
  imageCover: string;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  subcategory: Array<{
    _id: string;
    name: string;
    slug: string;
    category: string;
  }>;
  brand: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartItem[];
}

export interface CartWithProducts extends Omit<Cart, 'products'> {
  products: Array<{
    product: Product;
    quantity: number;
  }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiResponse<T> {
  results?: number;
  metadata?: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: T;
}
