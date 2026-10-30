import type { BudgetOverviewResponse, SetOverallLimitRequest, UpsertCategoryBudgetRequest } from '../types/budget.types';

export const budgetService = {
  getBudgetOverview: async (): Promise<BudgetOverviewResponse> => {
    const response = await fetch('http://localhost:5000/api/budgets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch budget overview');
    }
    return response.json();
  },

  setOverallLimit: async (payload: SetOverallLimitRequest) => {
    const response = await fetch('http://localhost:5000/api/budgets/overall-limit', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to set overall limit');
    }
    return response.json();
  },

  upsertCategoryBudget: async (payload: UpsertCategoryBudgetRequest) => {
    const response = await fetch('http://localhost:5000/api/budgets/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to set category budget');
    }
    return response.json();
  }
};
