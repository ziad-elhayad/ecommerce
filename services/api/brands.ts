// services/api/brands.ts

import apiClient from './config';

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandsResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
  };
  data: Brand[];
}

function extractBrandList(raw: unknown): Brand[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    if ('data' in raw) {
      const d = (raw as { data: unknown }).data;
      if (Array.isArray(d)) return d;
    }
  }
  return [];
}

export const brandsApi = {
  getAll: async (): Promise<Brand[]> => {
    try {
      const response = await apiClient.get<BrandsResponse | Brand[]>('/brands');
      return extractBrandList(response.data);
    } catch (error: unknown) {
      console.error('Get brands error:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Brand | null> => {
    try {
      const response = await apiClient.get<{ data: Brand }>(`/brands/${id}`);
      const raw = response.data;
      const data = raw && typeof raw === 'object' && 'data' in raw ? (raw as { data: Brand }).data : raw;
      return data ?? null;
    } catch (error: unknown) {
      console.error('Get brand error:', error);
      return null;
    }
  },
};
