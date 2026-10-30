import { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import type { CategoryBreakdownItem } from '../types/expense.types';
import toast from 'react-hot-toast';

export const useCategoryBreakdown = () => {
  const [breakdown, setBreakdown] = useState<CategoryBreakdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreakdown = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseService.getCategoryBreakdown();
      setBreakdown(response.data.breakdown);
    } catch (err: any) {
      setError(err.message || 'Failed to load category breakdown');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakdown();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchBreakdown();
    };
    window.addEventListener('voicespend:refresh', handleRefresh);
    return () => {
      window.removeEventListener('voicespend:refresh', handleRefresh);
    };
  }, []);

  return { breakdown, isLoading, error, refetch: fetchBreakdown };
};
