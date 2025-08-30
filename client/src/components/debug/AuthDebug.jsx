import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const AuthDebug = () => {
  const { user, isAuthenticated, refreshAuth } = useContext(AuthContext);
  const [authStatus, setAuthStatus] = useState('Checking...');
  const [cookies, setCookies] = useState('');

  useEffect(() => {
    checkAuthStatus();
    setCookies(document.cookie || 'No cookies');
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setAuthStatus('✅ Authenticated via /auth/me');
      } else {
        setAuthStatus('❌ /auth/me failed but no error');
      }
    } catch (err) {
      setAuthStatus(`❌ /auth/me failed: ${err.response?.status || 'Unknown error'}`);
    }
  };

  const handleRefreshAuth = async () => {
    setAuthStatus('🔄 Refreshing...');
    const success = await refreshAuth();
    if (success) {
      setAuthStatus('✅ Authentication refreshed successfully');
    } else {
      setAuthStatus('❌ Failed to refresh authentication');
    }
  };

  if (!process.env.NODE_ENV === 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="text-sm space-y-1">
        <div>User: {user ? `${user.email} (${user._id})` : 'None'}</div>
        <div>isAuthenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>Auth Status: {authStatus}</div>
        <div>Cookies: {cookies ? 'Present' : 'None'}</div>
        <button
          onClick={handleRefreshAuth}
          className="mt-2 px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
        >
          Refresh Auth
        </button>
        <button
          onClick={checkAuthStatus}
          className="mt-2 ml-2 px-3 py-1 bg-green-600 rounded text-xs hover:bg-green-700"
        >
          Check Status
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
