import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, userApi } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fanhub_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('fanhub_token') || null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore & verify session on initial mount / token change
  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('fanhub_token');
      if (!storedToken) {
        if (isMounted) {
          setCurrentUser(null);
          setToken(null);
          setAuthLoading(false);
        }
        return;
      }

      try {
        const data = await authApi.getMe();
        if (isMounted && data.success && data.user) {
          setCurrentUser(data.user);
          setToken(storedToken);
          localStorage.setItem('fanhub_user', JSON.stringify(data.user));
        }
      } catch (err) {
        if (isMounted) {
          localStorage.removeItem('fanhub_token');
          localStorage.removeItem('fanhub_user');
          setCurrentUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    checkAuthStatus();

    const handleUnauthorized = () => {
      if (isMounted) {
        setCurrentUser(null);
        setToken(null);
      }
    };

    window.addEventListener('fanhub_auth_unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('fanhub_auth_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    try {
      if (!email || !email.trim()) {
        return { success: false, error: 'Email address is required' };
      }
      if (!password) {
        return { success: false, error: 'Password is required' };
      }

      const data = await authApi.login({
        email: email.trim().toLowerCase(),
        password
      });

      if (data.success && data.token && data.user) {
        localStorage.setItem('fanhub_token', data.token);
        localStorage.setItem('fanhub_user', JSON.stringify(data.user));
        setToken(data.token);
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }

      return { success: false, error: data.message || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid email or password' };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      if (!name || !name.trim()) {
        return { success: false, error: 'Full name is required' };
      }
      if (!email || !email.trim()) {
        return { success: false, error: 'Email address is required' };
      }
      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      const regData = await authApi.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      if (regData.success) {
        // Auto login after successful registration
        const loginRes = await login(email, password);
        if (loginRes.success) {
          return { success: true, user: loginRes.user };
        }
        return { success: true, user: regData.user };
      }

      return { success: false, error: regData.message || 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('fanhub_token');
    localStorage.removeItem('fanhub_user');
    setToken(null);
    setCurrentUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      if (!email || !email.trim()) {
        return { success: false, error: 'Email address is required' };
      }
      const data = await authApi.forgotPassword({ email: email.trim().toLowerCase() });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to send password reset email' };
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      if (!resetToken) {
        return { success: false, error: 'Reset token is required' };
      }
      if (!newPassword || newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters' };
      }

      const data = await authApi.resetPassword({
        token: resetToken,
        password: newPassword
      });

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message || 'Password reset failed or token expired' };
    }
  };

  const updateProfile = async (updatedFields) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    try {
      const data = await userApi.updateProfile(updatedFields);
      if (data.success && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('fanhub_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Failed to update profile' };
    } catch (err) {
      if (updatedFields && !(updatedFields instanceof FormData) && typeof updatedFields === 'object') {
        const updated = { ...currentUser, ...updatedFields };
        setCurrentUser(updated);
        localStorage.setItem('fanhub_user', JSON.stringify(updated));
        return { success: true, user: updated };
      }
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        authLoading,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
