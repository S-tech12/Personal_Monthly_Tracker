import type { Auth, LoginCredentials, LoginResponse, SignupRequest, SignupResponse, VerifyOtpRequest, VerifyOtpResponse, GetCurrentUserResponse, ForgotPasswordRequest, ResetPasswordRequest, DefaultResponse } from '../types/auth.types';
import { apiClient } from './apiClient';

export const authService = {
  login: async (payload: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  getCurrentUser: async (): Promise<GetCurrentUserResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  signup: async (payload: SignupRequest): Promise<SignupResponse> => {
    // Assuming apiClient handles base URL and JSON parsing
    // But since this is a new backend, we will use fetch for now or apiClient if it's configured
    // Wait, let's look at what apiClient is exactly. Let's just use it if it exposes post.
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  verifySignupOtp: async (payload: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<DefaultResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<DefaultResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to verify OTP');
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  updatePassword: async (payload: { newPassword?: string; confirmPassword?: string }): Promise<DefaultResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/update-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update password');
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  deleteAccount: async (): Promise<DefaultResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete account');
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  }
};
