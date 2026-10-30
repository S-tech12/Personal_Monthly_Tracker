import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';
import type { Expense } from '../types/expense.types';
import toast from 'react-hot-toast';

export const useRecentExpenses = (limit: number = 10) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseService.getRecentExpenses(limit);
      setExpenses(response.data.expenses);
    } catch (err: any) {
      setError(err.message || 'Failed to load recent expenses');
      toast.error(err.message || 'Failed to load recent expenses');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  useEffect(() => {
    const handleRefresh = () => fetchRecent();
    window.addEventListener('voicespend:refresh', handleRefresh);
    return () => window.removeEventListener('voicespend:refresh', handleRefresh);
  }, [fetchRecent]);

  return { expenses, isLoading, error, refetch: fetchRecent };
};
