import React from 'react';

const TextArea = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  rows = 4,
  helpText,
  maxLength,
  ...rest
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id || name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <textarea
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full rounded-md shadow-sm px-3 py-2
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
        `}
        {...rest}
      />
      
      {maxLength && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">
            {value?.length || 0}/{maxLength}
          </span>
        </div>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default TextArea;