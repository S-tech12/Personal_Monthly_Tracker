import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { expenseService } from '../services/expenseService';
import { ROUTES } from '../constants/routes';

export const useExpenseSubmit = (onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitExpense = async (transcript: string) => {
    setIsSubmitting(true);
    try {
      const response = await expenseService.createFromVoice({ transcript });
      toast.success(response.message || 'Expenses added successfully');
      
      // Reset the overlay state
      onSuccess();

      // Navigate to History page
      navigate(ROUTES.HISTORY);
    } catch (error: any) {
      toast.error(error.message || 'Could not understand the expense details, please try again');
      // On failure, we don't call onSuccess(), keeping the overlay open in review state
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitExpense
  };
};
