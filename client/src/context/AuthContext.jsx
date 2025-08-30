import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Get user data using cookies for authentication
        const res = await api.get('/auth/me');
        setUser(res.data.data);
      } catch (err) {
        // This is expected if user is not logged in, no need to log as error
        if (err.response && err.response.status === 401) {
          // User is not authenticated, this is normal
          setUser(null);
        } else {
          // Log other unexpected errors
          console.error('Error checking authentication:', err);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Registering user with data:', userData);
      const res = await api.post('/auth/register', userData);
      console.log('Registration response:', res.data);
      
      // After successful registration, set the user data from the response
      // The backend sends back the user data in the registration response
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        toast.success('Registration successful!');
        return true;
      } else {
        setError('Registration response was invalid');
        toast.error('Registration failed: Invalid response');
        return false;
      }
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Registration failed');
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', { email, password: '********' });
      const res = await api.post('/auth/login', { email, password });
      console.log('Login response:', res.data);
      
      // Token is handled by cookies
      
              // Get user data
        const userRes = await api.get('/auth/me');
        console.log('User data:', userRes.data);
        setUser(userRes.data.data);
      
      toast.success('Login successful!');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      setError(err.response?.data?.message || 'Invalid credentials');
      toast.error(err.response?.data?.message || 'Invalid credentials');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Call the server to clear the cookie
      await api.post('/auth/logout');
      setUser(null);
      toast.info('Logged out successfully');
    } catch (err) {
      console.error('Error logging out:', err);
      // Still clear user data on client side
      setUser(null);
      toast.info('Logged out successfully');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const res = await api.put('/users/profile', userData);
      setUser(res.data.data);
      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      toast.error(err.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset password request
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset email sent');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
      toast.error(err.response?.data?.message || 'Failed to send reset email');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (password, token) => {
    try {
      setLoading(true);
      await api.put(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successful. Please login.');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      toast.error(err.response?.data?.message || 'Failed to reset password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};