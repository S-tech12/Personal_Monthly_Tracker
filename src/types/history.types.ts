export interface HistoryExpense {
  id: string;
  category: string;
  icon: string;
  amount: number;
  time: string;
  date: string;
  currency?: string;
}

export interface DailyHistoryGroup {
  dateHeader: string;
  totalAmount: number;
  expenses: HistoryExpense[];
}

export type HistoryViewMode = 'daily' | 'monthly';
