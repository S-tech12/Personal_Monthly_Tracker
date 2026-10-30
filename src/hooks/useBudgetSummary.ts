import { useState, useEffect } from 'react';
import { budgetService } from '../services/budgetService';
import type { OverallBudget } from '../types/budget.types';
import toast from 'react-hot-toast';

export const useBudgetSummary = () => {
  const [overallBudgets, setOverallBudgets] = useState<OverallBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await budgetService.getBudgetOverview();
      setOverallBudgets(response.data.overallBudgets);
    } catch (err: any) {
      setError(err.message || 'Failed to load budget summary');
      toast.error(err.message || 'Failed to load budget summary');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { overallBudgets, isLoading, error, refetch };
};
