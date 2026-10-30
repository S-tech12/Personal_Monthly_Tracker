import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { User } from '../types/auth.types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (user: User) => void;
  logout: (message?: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = async (message: string = 'Logged out successfully') => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout error', e);
    }
    setUser(null);
    toast.success(message);
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isCheckingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
