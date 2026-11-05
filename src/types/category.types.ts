export type CategoryType = 'Credit' | 'Debit';

export interface Subcategory {
  _id: string;
  name: string;
  active: boolean;
}

export interface UserCategory {
  _id: string;
  name: string;
  type: CategoryType;
  description?: string;
  icon?: string | null;
  color?: string | null;
  active: boolean;
  subcategories: Subcategory[];
}

export interface CategoriesResponse {
  success: boolean;
  data: { categories: UserCategory[] };
}
