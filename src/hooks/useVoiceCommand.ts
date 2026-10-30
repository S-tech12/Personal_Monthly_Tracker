import { useState } from 'react';
import { voiceCommandService } from '../services/voiceCommandService';
import toast from 'react-hot-toast';

export const useVoiceCommand = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitCommand = async (transcript: string) => {
    if (!transcript.trim()) {
      toast.error('Please say a command first');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await voiceCommandService.sendVoiceCommand({ transcript });
      
      if (response.success && response.data && response.data.results) {
        response.data.results.forEach((msg) => toast.success(msg, { duration: 5000 }));
        window.dispatchEvent(new Event('voicespend:refresh'));
        if (onSuccess) onSuccess();
      } else {
        toast.error('Command completed but no results were returned.');
      }
    } catch (err: any) {
      let errorMessage = 'Failed to execute voice command. Please try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submitCommand };
};
