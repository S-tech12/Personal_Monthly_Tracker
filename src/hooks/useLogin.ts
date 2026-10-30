import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ROUTES } from '../constants/routes';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotOtp, setForgotOtp] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoggingIn(true);
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        login(response.data.user);
        toast.success('Logged in successfully');
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const openForgotModal = () => {
    setIsForgotModalOpen(true);
    setForgotStep(1);
    setForgotEmail('');
    setForgotOtp('');
  };

  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
  };

  const handleSendOtp = async () => {
    if (!forgotEmail) return;
    setIsForgotLoading(true);
    try {
      await authService.forgotPassword({ email: forgotEmail });
      toast.success('OTP sent to your email');
      setForgotStep(2);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!forgotOtp) return;
    setIsForgotLoading(true);
    try {
      await authService.resetPassword({ email: forgotEmail, otp: forgotOtp });
      toast.success('New password sent to your email!');
      closeForgotModal();
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      setIsForgotLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    isLoggingIn,
    errors,
    handleLogin,
    isForgotModalOpen,
    forgotEmail,
    setForgotEmail,
    forgotStep,
    forgotOtp,
    setForgotOtp,
    isForgotLoading,
    openForgotModal,
    closeForgotModal,
    handleSendOtp,
    handleVerifyOtp,
  };
};
