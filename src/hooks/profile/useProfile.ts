import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../useAuth';
import { authService } from '../../services/authService';

import Swal from 'sweetalert2';

export const useProfile = () => {
  const { user, isCheckingAuth, logout } = useAuth();
  
  const email = user?.email || '';
  const profilePictureUrl = user?.profilePictureUrl || '';
  const name = user?.name || '';
  const memberSince = user?.memberSince || '';

  const [imageUrl, setImageUrl] = useState<string | null>(profilePictureUrl || null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // When user data is available (after auth check), update the local image preview if needed
    if (user?.profilePictureUrl) {
      setImageUrl(user.profilePictureUrl);
    } else {
      setImageUrl(null);
    }
  }, [user?.profilePictureUrl]);

  const handleImageSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setSelectedImageFile(file);
  };

  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!newPassword && !confirmPassword) {
      toast('Enter a new password to update it', { icon: 'ℹ️' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (!/\d/.test(newPassword)) {
      setPasswordError('Password must contain at least one number');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      await authService.updatePassword({ newPassword, confirmPassword });
      toast.success('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to log out of your account?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1E3A8A',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, log out'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: 'Delete Account?',
      text: 'This action cannot be undone. All your data will be lost.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await authService.deleteAccount();
          logout('Account deleted successfully');
        } catch (error: any) {
          toast.error(error.message || 'Failed to delete account');
        }
      }
    });
  };

  return {
    email,
    name,
    memberSince,
    imageUrl,
    selectedImageFile,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    toggleShowNewPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
    handleImageSelect,
    handleSubmit,
    isSaving,
    isLoading: isCheckingAuth,
    passwordError,
    logout: handleLogout,
    handleDeleteAccount
  };
};
