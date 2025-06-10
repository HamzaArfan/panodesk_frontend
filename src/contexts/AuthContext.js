'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../lib/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true, user: userData };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      toast.success('Registration successful! Please verify your email.');
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
      setIsAuthenticated(false);
      toast.error('Logout failed');
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      toast.success('Password reset email sent!');
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      toast.success('Password reset successful!');
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token);
      toast.success('Email verified successfully!');
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const acceptInvitation = async (token, userData) => {
    try {
      const response = await authAPI.acceptInvitation(token, userData);
      if (response.data.success) {
        const user = response.data.user;
        setUser(user);
        setIsAuthenticated(true);
        toast.success('Invitation accepted successfully!');
        return { success: true, user };
      } else {
        throw new Error(response.data.message || 'Failed to accept invitation');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to accept invitation';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Helper functions for role checking
  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const isSuperAdmin = () => hasRole('SUPER_ADMIN');
  const isSystemUser = () => hasRole('SYSTEM_USER');
  const isOrgManager = () => hasRole('ORGANIZATION_MANAGER');
  const isReviewer = () => hasRole('REVIEWER');

  const canManageUsers = () => hasAnyRole(['SUPER_ADMIN', 'SYSTEM_USER']);
  const canManageOrganizations = () => hasAnyRole(['SUPER_ADMIN', 'SYSTEM_USER']);
  const canManageProjects = () => hasAnyRole(['SUPER_ADMIN', 'SYSTEM_USER', 'ORGANIZATION_MANAGER']);
  const canManageTours = () => hasAnyRole(['SUPER_ADMIN', 'SYSTEM_USER', 'ORGANIZATION_MANAGER', 'REVIEWER']);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    acceptInvitation,
    checkAuth,
    // Role checking helpers
    hasRole,
    hasAnyRole,
    isSuperAdmin,
    isSystemUser,
    isOrgManager,
    isReviewer,
    canManageUsers,
    canManageOrganizations,
    canManageProjects,
    canManageTours,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 