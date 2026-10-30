import { useState, useEffect, useCallback } from 'react';
import { budgetService } from '../services/budgetService';
import { settingsService } from '../services/settingsService';
import type { OverallBudget, CategoryBudget } from '../types/budget.types';

export const useBudget = () => {
  const [overallBudgets, setOverallBudgets] = useState<OverallBudget[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultCurrency, setDefaultCurrency] = useState<string>('INR');

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [res, settingsRes] = await Promise.all([
        budgetService.getBudgetOverview(),
        settingsService.getSettings()
      ]);
      
      if (res.success) {
        setOverallBudgets(res.data.overallBudgets);
        setCategoryBudgets(res.data.categoryBudgets);
      }
      
      if (settingsRes.success && settingsRes.data.settings.defaultCurrency) {
        setDefaultCurrency(settingsRes.data.settings.defaultCurrency);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const refetch = () => {
    fetchBudgets();
  };

  const handleSetOverallLimit = async (currency: string, limit: number) => {
    setIsSaving(true);
    setError(null);
    try {
      await budgetService.setOverallLimit({ currency, limit });
      // TODO: show success toast
      refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to set overall limit');
      // TODO: show error toast
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpsertCategoryBudget = async (category: string, monthlyLimit: number, currency: string) => {
    setIsSaving(true);
    setError(null);
    try {
      await budgetService.upsertCategoryBudget({ category, monthlyLimit, currency });
      // TODO: show success toast
      refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to save category budget');
      // TODO: show error toast
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    overallBudgets,
    categoryBudgets,
    isLoading,
    isSaving,
    error,
    defaultCurrency,
    refetch,
    handleSetOverallLimit,
    handleUpsertCategoryBudget
  };
};
