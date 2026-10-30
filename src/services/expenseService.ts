import type { CreateVoiceExpenseRequest, CreateVoiceExpenseResponse, ParsedVoiceExpenseResponse, Expense, GetExpensesByDateResponse, GetExpenseSummaryResponse, CategoryBreakdownResponse, RecentExpensesResponse } from '../types/expense.types';

export const expenseService = {
  createFromVoice: async (payload: CreateVoiceExpenseRequest): Promise<CreateVoiceExpenseResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create expense from voice');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  parseFromVoice: async (payload: CreateVoiceExpenseRequest): Promise<ParsedVoiceExpenseResponse> => {
    const response = await fetch('http://localhost:5000/api/expenses/voice/parse', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to parse voice input');
    return data;
  },

  createBulk: async (expenses: Array<Pick<Expense, 'title' | 'category' | 'amount' | 'currency'>>) => {
    const response = await fetch('http://localhost:5000/api/expenses/bulk', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ expenses })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to save expenses');
    return data;
  },
  
  getExpensesByDate: async (date: string): Promise<GetExpensesByDateResponse> => {
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/by-date?date=${date}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch expenses');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  getExpenseSummary: async (): Promise<GetExpenseSummaryResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses/summary', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch expense summary');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  getCategoryBreakdown: async (): Promise<CategoryBreakdownResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses/category-breakdown', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch category breakdown');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  getRecentExpenses: async (limit: number = 10): Promise<RecentExpensesResponse> => {
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/recent?limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recent expenses');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  }
};
