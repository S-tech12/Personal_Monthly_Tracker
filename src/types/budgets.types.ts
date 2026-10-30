export type BudgetStatus = 'on-track' | 'warning' | 'over-budget' | 'early-days';

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  iconColorClass: string;
  status: BudgetStatus;
  limit: number;
  used: number;
}

export interface NewBudgetPayload {
  name: string;
  limit: number;
  currency: string;
}
