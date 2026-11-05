import { API_URL } from './apiConfig';
import type { CategoriesResponse, CategoryType, UserCategory } from '../types/category.types';

const request = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${API_URL}${path}`, { ...init, credentials: 'include', headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Category request failed');
  return data;
};

export const categoryService = {
  list: async (type?: CategoryType): Promise<CategoriesResponse> => request(`/categories${type ? `?type=${type}` : ''}`),
  create: async (payload: { name: string; type: CategoryType; description?: string }) => request('/categories', { method: 'POST', body: JSON.stringify(payload) }),
  update: async (id: string, payload: { name?: string; description?: string }) => request(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: async (id: string) => request(`/categories/${id}`, { method: 'DELETE' }),
  addSubcategory: async (categoryId: string, name: string) => request(`/categories/${categoryId}/subcategories`, { method: 'POST', body: JSON.stringify({ name }) }),
  updateSubcategory: async (categoryId: string, subCategoryId: string, name: string) => request(`/categories/${categoryId}/subcategories/${subCategoryId}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
  removeSubcategory: async (categoryId: string, subCategoryId: string) => request(`/categories/${categoryId}/subcategories/${subCategoryId}`, { method: 'DELETE' })
};

export const categoryListFromResponse = (data: CategoriesResponse) => data.data.categories as UserCategory[];
