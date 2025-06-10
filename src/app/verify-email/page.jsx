'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { AUTH_ROUTES } from '../../constants';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.post('/api/auth/verify-email', { token });
      
      if (response.data.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully! You can now log in.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(AUTH_ROUTES.LOGIN);
        }, 3000);
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Email verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Email verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Logo className="w-8 h-8" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            {status === 'verifying' && (
              <div className="space-y-4">
                <Loader className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
                <p className="text-gray-600">Verifying your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-green-900 mb-2">
                    Email Verified Successfully!
                  </h3>
                  <p className="text-green-700 mb-4">{message}</p>
                  <p className="text-sm text-gray-600">
                    Redirecting to login page in 3 seconds...
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="w-12 h-12 text-red-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-red-900 mb-2">
                    Verification Failed
                  </h3>
                  <p className="text-red-700 mb-4">{message}</p>
                  <div className="space-y-2">
                    <Link
                      href={AUTH_ROUTES.LOGIN}
                      className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Go to Login
                    </Link>
                    <Link
                      href={AUTH_ROUTES.SIGNUP}
                      className="block w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Sign Up Again
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 