import type { CreateVoiceExpenseRequest, CreateVoiceExpenseResponse, ParsedVoiceExpenseResponse, Expense, GetExpensesByDateResponse, GetExpenseSummaryResponse, CategoryBreakdownResponse, RecentExpensesResponse } from '../types/expense.types';
import { API_URL } from './apiConfig';

export const expenseService = {
  createFromVoice: async (payload: CreateVoiceExpenseRequest): Promise<CreateVoiceExpenseResponse> => {
    try {
      const response = await fetch(`${API_URL}/expenses/voice`, {
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
    const response = await fetch(`${API_URL}/expenses/voice/parse`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to parse voice input');
    return data;
  },

  createBulk: async (expenses: Array<Pick<Expense, 'title' | 'category' | 'amount' | 'currency' | 'type'>>) => {
    const response = await fetch(`${API_URL}/expenses/bulk`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ expenses })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to save expenses');
    return data;
  },
  
  getExpensesByDate: async (date: string): Promise<GetExpensesByDateResponse> => {
    try {
      const response = await fetch(`${API_URL}/expenses/by-date?date=${date}`, {
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
      const response = await fetch(`${API_URL}/expenses/summary`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store'
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
      const response = await fetch(`${API_URL}/expenses/category-breakdown`, {
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
      const response = await fetch(`${API_URL}/expenses/recent?limit=${limit}`, {
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
  },

  getCurrentMonthExpenses: async (): Promise<RecentExpensesResponse> => {
    const response = await fetch(`${API_URL}/expenses/current-month`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch current month transactions');
    return data;
  },

  getCurrentWeekExpenses: async (): Promise<RecentExpensesResponse> => {
    const response = await fetch(`${API_URL}/expenses/current-week`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch current week transactions');
    return data;
  }
};
