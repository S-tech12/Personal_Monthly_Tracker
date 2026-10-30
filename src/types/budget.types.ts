export interface OverallBudget {
  currency: string;
  limit: number | null;
  currentSpent: number;
  isOverallOverLimit: boolean;
  remaining: number | null;
}

export interface CategoryBudget {
  category: string;
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
  monthlyLimit: number;
  currency: string;
}
