import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

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

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.data);
      } catch (err) {
        // User is not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      
      // Try to verify the user immediately after registration
      try {
        const userRes = await api.get('/auth/me');
        setUser(userRes.data.data);
      } catch (verifyErr) {
        // User verification failed, but registration was successful
      }
      
      return { success: true, data: res.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      // Set user from response
      setUser(res.data.user);
      
      return { success: true, data: res.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const res = await api.put('/auth/profile', userData);
      setUser(res.data.data);
      return { success: true, data: res.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Password change failed' 
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return { success: true, data: res.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Password reset request failed' 
      };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Password reset failed' 
      };
    }
  };

  const refreshAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
      return { success: true, data: res.data };
    } catch (err) {
      setUser(null);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Authentication refresh failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;