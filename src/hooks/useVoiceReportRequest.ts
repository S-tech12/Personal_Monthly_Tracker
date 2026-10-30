import { useState } from 'react';
import { reportService } from '../services/reportService';
import toast from 'react-hot-toast';

export const useVoiceReportRequest = (onComplete?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReportRequest = async (transcript: string) => {
    try {
      setIsSubmitting(true);
      const response = await reportService.sendVoiceRequestedReport({ transcript });
      toast.success(response.message || `Report for ${response.data.periodLabel} sent to your email`);
    } catch (error: any) {
      toast.error(error.message || 'Could not understand the date range, please try again');
    } finally {
      setIsSubmitting(false);
      if (onComplete) onComplete();
    }
  };

  return {
    isSubmitting,
    submitReportRequest
  };
};
