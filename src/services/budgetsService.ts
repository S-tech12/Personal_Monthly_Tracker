import type { BudgetCategory, NewBudgetPayload } from '../types/budgets.types';

export const budgetsService = {
  getBudgets: async (): Promise<BudgetCategory[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'Food',
            icon: 'restaurant',
            iconColorClass: 'text-secondary',
            status: 'on-track',
            limit: 600,
            used: 420
          },
          {
            id: '2',
            name: 'Transport',
            icon: 'directions_car',
            iconColorClass: 'text-on-tertiary-container',
            status: 'warning',
            limit: 200,
            used: 185
          },
          {
            id: '3',
            name: 'Rent',
            icon: 'home',
            iconColorClass: 'text-error',
            status: 'over-budget',
            limit: 1200,
            used: 1250
          },
          {
            id: '4',
            name: 'Entertainment',
            icon: 'movie',
            iconColorClass: 'text-primary',
            status: 'early-days',
            limit: 150,
            used: 12
          }
        ]);
      }, 1000);
    });
  },

  createBudget: async (payload: NewBudgetPayload): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
};
