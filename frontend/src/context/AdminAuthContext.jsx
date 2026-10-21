import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, adminGetMe } from '../services/api';

const AdminAuthContext = createContext(null);

const TOKEN_KEY = 'momin_portfolio_admin_token';

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount or token change
  useEffect(() => {
    let mounted = true;

    const validateSession = async () => {
      if (!token) {
        if (mounted) {
          setAdmin(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await adminGetMe(token);
        if (mounted && response.success) {
          setAdmin(response.admin);
        }
      } catch (err) {
        // Token invalid or expired
        if (mounted) {
          logout();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    validateSession();

    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await adminLogin(email, password);
    if (res.success && res.token) {
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setAdmin(res.admin);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
