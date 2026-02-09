// services/api/users.ts

import apiClient from './config';
import { User } from '@/types';

export const usersApi = {
  // GET /users - Get all users
  getAll: async (limit?: number): Promise<User[]> => {
    const url = limit ? `/users?limit=${limit}` : '/users';
    const response = await apiClient.get<User[]>(url);
    return response.data;
  },

  // GET /users/:id - Get single user
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  // GET /users?sort=desc
  getAllSorted: async (sort: 'asc' | 'desc' = 'desc'): Promise<User[]> => {
    const response = await apiClient.get<User[]>(`/users?sort=${sort}`);
    return response.data;
  },
};
