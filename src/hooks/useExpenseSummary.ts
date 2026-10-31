import { useState, useEffect, useCallback, useRef } from 'react';
import { expenseService } from '../services/expenseService';
import type { ExpenseSummary } from '../types/expense.types';

type SavedTransaction = {
  amount: number;
  currency: string;
  type?: 'Debit' | 'Credit';
};

const updateTotals = (
  items: Array<{ currency: string; total: number }>,
  transaction: SavedTransaction,
  sign: 1 | -1
) => {
  const delta = transaction.amount * sign;
  const existing = items.find(item => item.currency === transaction.currency);
  if (existing) return items.map(item => item.currency === transaction.currency
    ? { ...item, total: item.total + delta }
    : item);
  return [{ currency: transaction.currency, total: delta }, ...items];
};

export const useExpenseSummary = () => {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const applySavedTransactions = useCallback((saved: SavedTransaction | SavedTransaction[]) => {
    const transactions = Array.isArray(saved) ? saved : [saved];
    setSummary(previous => {
      if (!previous) return previous;
      let next = { ...previous };

      for (const transaction of transactions) {
        const isIncome = transaction.type === 'Credit';
        const expenseDelta = 1;
        const incomeDelta = 1;

        next = {
          ...next,
          today: isIncome ? next.today : updateTotals(next.today, transaction, expenseDelta),
          thisMonth: isIncome ? next.thisMonth : updateTotals(next.thisMonth, transaction, expenseDelta),
          income: {
            today: isIncome ? updateTotals(next.income.today, transaction, incomeDelta) : next.income.today,
            thisMonth: isIncome ? updateTotals(next.income.thisMonth, transaction, incomeDelta) : next.income.thisMonth
          },
          expenses: {
            today: isIncome ? next.expenses.today : updateTotals(next.expenses.today, transaction, expenseDelta),
            thisMonth: isIncome ? next.expenses.thisMonth : updateTotals(next.expenses.thisMonth, transaction, expenseDelta)
          },
          net: {
            today: updateTotals(next.net.today, transaction, isIncome ? 1 : -1),
            thisMonth: updateTotals(next.net.thisMonth, transaction, isIncome ? 1 : -1)
          }
        };
      }
      return next;
    });
  }, []);

  const refetch = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    try {
      setIsLoading(true);
      setError(null);
      const response = await expenseService.getExpenseSummary();
      // Ignore an older response that arrived after a newer refresh.
      if (requestId === requestIdRef.current) {
        setSummary(response.data);
      }
    } catch (err: any) {
      if (requestId === requestIdRef.current) {
        setError(err.message || 'Failed to fetch expense summary');
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const handleRefresh = () => refetch();
    window.addEventListener('voicespend:refresh', handleRefresh);
    return () => window.removeEventListener('voicespend:refresh', handleRefresh);
  }, [refetch]);

  return { summary, isLoading, error, refetch, applySavedTransactions };
};
