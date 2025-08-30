import { useState, useEffect } from 'react';
import api from '../../services/api';

const ApiDebug = () => {
  const [apiInfo, setApiInfo] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Get API configuration info
    const getApiInfo = () => {
      const info = {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        PROD: import.meta.env.PROD,
        DEV: import.meta.env.DEV,
        MODE: import.meta.env.MODE,
        currentOrigin: window.location.origin,
        hostname: window.location.hostname,
        isLocalhost: window.location.hostname === 'localhost',
        userAgent: navigator.userAgent,
        // Determine what URL would be used
        wouldUseProduction: import.meta.env.PROD || window.location.hostname !== 'localhost'
      };
      setApiInfo(info);
    };

    getApiInfo();
  }, []);

  const testApiConnection = async () => {
    try {
      setTestResult({ status: 'testing', message: 'Testing API connection...' });
      
      const response = await api.get('/health');
      setTestResult({ 
        status: 'success', 
        message: 'API connection successful!',
        data: response.data 
      });
    } catch (error) {
      setTestResult({ 
        status: 'error', 
        message: 'API connection failed',
        error: error.message,
        details: error.response?.data || error.config
      });
    }
  };

  if (!apiInfo) return <div>Loading API debug info...</div>;

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm">
      <h3 className="font-bold mb-2">🔧 API Debug Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-semibold">Environment Variables:</h4>
          <ul className="space-y-1">
            <li><strong>VITE_API_URL:</strong> {apiInfo.VITE_API_URL || 'Not set'}</li>
            <li><strong>PROD:</strong> {apiInfo.PROD ? 'Yes' : 'No'}</li>
            <li><strong>DEV:</strong> {apiInfo.DEV ? 'Yes' : 'No'}</li>
            <li><strong>MODE:</strong> {apiInfo.MODE}</li>
            <li><strong>Would Use Production:</strong> {apiInfo.wouldUseProduction ? 'Yes' : 'No'}</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold">Current Environment:</h4>
          <ul className="space-y-1">
            <li><strong>Origin:</strong> {apiInfo.currentOrigin}</li>
            <li><strong>Hostname:</strong> {apiInfo.hostname}</li>
            <li><strong>Is Localhost:</strong> {apiInfo.isLocalhost ? 'Yes' : 'No'}</li>
            <li><strong>User Agent:</strong> {apiInfo.userAgent.substring(0, 50)}...</li>
          </ul>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={testApiConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test API Connection
        </button>
      </div>

      {testResult && (
        <div className={`p-3 rounded ${
          testResult.status === 'success' ? 'bg-green-100 text-green-800' :
          testResult.status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          <h4 className="font-semibold">Test Result:</h4>
          <p>{testResult.message}</p>
          {testResult.error && (
            <details className="mt-2">
              <summary className="cursor-pointer">Error Details</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(testResult.details, null, 2)}
              </pre>
            </details>
          )}
          {testResult.data && (
            <details className="mt-2">
              <summary className="cursor-pointer">Response Data</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiDebug;
