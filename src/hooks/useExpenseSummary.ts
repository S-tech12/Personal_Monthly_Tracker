import { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import type { ExpenseSummary } from '../types/expense.types';

export const useExpenseSummary = () => {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseService.getExpenseSummary();
      setSummary(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expense summary');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const handleRefresh = () => refetch();
    window.addEventListener('voicespend:refresh', handleRefresh);
    return () => window.removeEventListener('voicespend:refresh', handleRefresh);
  }, []);

  return { summary, isLoading, error, refetch };
};
