// src/types/product.types.ts

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover?: string;
  image?: string;
  images?: string[];
  category: Category | string;
  brand?: Brand;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  rating?: Rating;
  quantity?: number;
  sold?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
