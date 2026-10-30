export interface Expense {
  _id: string;
  title: string;
  category: string;
  amount: number;
  currency: string;
  expenseDateTime: string;
  source: string;
  type?: 'Debit' | 'Credit';
  person?: string | null;
  date?: string;
  addedBy?: {
    id: string;
    name: string;
    profilePictureUrl: string;
  } | null;
}

export interface CreateVoiceExpenseRequest {
  transcript: string;
}

export interface CreateVoiceExpenseResponse {
  success: boolean;
  message: string;
  data: {
    expense: Expense;
  };
}

export interface ParsedVoiceExpenseResponse {
  success: boolean;
  data: {
    expenses: Array<Pick<Expense, 'title' | 'category' | 'amount' | 'currency' | 'type' | 'person' | 'date'>>;
    incomes: Array<Pick<Expense, 'title' | 'category' | 'amount' | 'currency' | 'type' | 'person' | 'date'>>;
  };
}

export interface GetExpensesByDateResponse {
  success: boolean;
  data: {
    expenses: Expense[];
    date: string;
  };
}

export interface CurrencyTotal {
  currency: string;
  total: number;
}

export interface ExpenseSummary {
  today: CurrencyTotal[];
  thisMonth: CurrencyTotal[];
}

export interface GetExpenseSummaryResponse {
  success: boolean;
  data: ExpenseSummary;
}

export interface CategoryBreakdownItem {
  category: string;
  currency: string;
  total: number;
  count: number;
}

export interface CategoryBreakdownResponse {
  success: boolean;
  data: {
    breakdown: CategoryBreakdownItem[];
  };
}

export interface RecentExpensesResponse {
  success: boolean;
  data: {
    expenses: Expense[];
  };
}
