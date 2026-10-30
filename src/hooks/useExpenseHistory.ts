import { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import type { Expense } from '../types/expense.types';

export const useExpenseHistory = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to today's date in YYYY-MM-DD
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await expenseService.getExpensesByDate(selectedDate);
      setExpenses(response.data.expenses);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expenses');
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedDate]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchExpenses();
    };
    window.addEventListener('voicespend:refresh', handleRefresh);
    return () => {
      window.removeEventListener('voicespend:refresh', handleRefresh);
    };
  }, [selectedDate]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  return {
    selectedDate,
    expenses,
    isLoading,
    error,
    handleDateChange,
    refetch: fetchExpenses
  };
};
