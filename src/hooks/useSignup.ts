import { useState } from 'react';
import { authService } from '../services/authService';

export const useSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState<{name?: string, email?: string, password?: string, api?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  
  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!name.trim() || name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    
    if (!password || password.length < 6 || !/\d/.test(password)) {
      newErrors.password = 'Password must be at least 6 characters and contain one number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await authService.signup({ name, email, password });
      setOtpModalOpen(true);
    } catch (err: any) {
      setErrors({ api: err.message || 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    otpModalOpen,
    setOtpModalOpen,
    handleSignup
  };
};
