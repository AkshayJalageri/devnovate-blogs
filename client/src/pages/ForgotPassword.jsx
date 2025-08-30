import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import TextInput from '../components/ui/TextInput';
import Button from '../components/ui/Button';

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Password reset email sent</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-600"
                  >
                    <FiArrowLeft className="mr-1" />
                    Back to login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <TextInput
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="Email address"
                required
                icon={<FiMail className="h-5 w-5 text-gray-400" />}
                error={error}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" /> {error}
              </div>
            )}

            <div>
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
              >
                <FiArrowLeft className="mr-1" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;