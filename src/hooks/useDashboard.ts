import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { dashboardService } from '../services/dashboardService';
import { reportService } from '../services/reportService';
import type { DashboardData } from '../types/dashboard.types';
import { useVoiceInput } from './useVoiceInput';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    isListening,
    isReviewing,
    transcript,
    setTranscript,
    secondsRemaining,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    startListening,
    stopListening,
    reset
  } = useVoiceInput();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dashboardService.getDashboardData();
        setData(result);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleMic = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const handleSendReport = async () => {
    const loadingToastId = toast.loading('Sending report...');
    try {
      await reportService.sendCurrentMonthReport();
      toast.success('Report sent to your email', { id: loadingToastId });
    } catch (error: any) {
      if (error.message === 'No expenses found for this month yet') {
        toast.error('No expenses found for this month yet', { id: loadingToastId });
      } else {
        toast.error(error.message || 'Failed to send report', { id: loadingToastId });
      }
    }
  };

  return {
    data,
    isLoading,
    isListening,
    isReviewing,
    transcript,
    setTranscript,
    secondsRemaining,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    startListening,
    stopListening,
    reset,
    toggleMic,
    handleSendReport
  };
};
