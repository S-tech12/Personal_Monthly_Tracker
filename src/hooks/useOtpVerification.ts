import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { ROUTES } from '../constants/routes';

export const useOtpVerification = (email: string, onClose: () => void) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('OTP must be exactly 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.verifySignupOtp({ email, otp });
      onClose();
      toast.success('Account verified! Please log in.');
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    isLoading,
    error,
    handleVerify
  };
};
