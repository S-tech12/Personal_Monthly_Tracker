import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { budgetsService } from '../services/budgetsService';
import type { BudgetCategory, NewBudgetPayload } from '../types/budgets.types';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');
  const [newBudgetCurrency, setNewBudgetCurrency] = useState('USD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice State
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    const handleRefresh = () => fetchBudgets();
    window.addEventListener('voicespend:refresh', handleRefresh);
    return () => window.removeEventListener('voicespend:refresh', handleRefresh);
  }, []);

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const data = await budgetsService.getBudgets();
      setBudgets(data);
    } catch (error) {
      toast.error('Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form
    setNewBudgetName('');
    setNewBudgetLimit('');
    setNewBudgetCurrency('USD');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetName || !newBudgetLimit) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading('Saving category...');
    
    try {
      const payload: NewBudgetPayload = {
        name: newBudgetName,
        limit: parseFloat(newBudgetLimit),
        currency: newBudgetCurrency,
      };
      
      await budgetsService.createBudget(payload);
      toast.success('Category saved successfully', { id: loadingToastId });
      handleCloseModal();
      
      // Refresh list
      fetchBudgets();
    } catch (error) {
      toast.error('Failed to save category', { id: loadingToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMic = () => {
    setIsListening(!isListening);
  };

  return {
    budgets,
    isLoading,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    newBudgetName,
    setNewBudgetName,
    newBudgetLimit,
    setNewBudgetLimit,
    newBudgetCurrency,
    setNewBudgetCurrency,
    isSubmitting,
    handleSaveCategory,
    isListening,
    toggleMic
  };
};
