export interface OverallBudget {
  currency: string;
  limit: number | null;
  currentSpent: number;
  isOverallOverLimit: boolean;
  remaining: number | null;
}

export interface CategoryBudget {
  category: string;
  categoryId?: string | null;
  type?: 'Credit' | 'Debit';
  monthlyLimit: number;
  currency: string;
  currentSpent: number;
  isOverLimit: boolean;
}

export interface BudgetOverviewResponse {
  success: boolean;
  data: {
    overallBudgets: OverallBudget[];
    categoryBudgets: CategoryBudget[];
  };
}

export interface SetOverallLimitRequest {
  currency: string;
  limit: number;
}

export interface UpsertCategoryBudgetRequest {
  category: string;
  categoryId?: string;
  type?: 'Credit' | 'Debit';
  monthlyLimit: number;
  currency: string;
}
