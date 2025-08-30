import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'blue', fullScreen = false }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-t-2 border-b-2',
    xl: 'h-16 w-16 border-t-2 border-b-2'
  };
  
  // Color classes
  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500'
  };
  
  // Combine classes
  const spinnerClasses = `animate-spin rounded-full ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.blue}`;
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className={spinnerClasses}></div>
      </div>
    );
  }
  
  return <div className={spinnerClasses}></div>;
};

export default LoadingSpinner;