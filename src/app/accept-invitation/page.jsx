'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader, Mail, User, Lock } from 'lucide-react';
import { authAPI } from '../../lib/api';
import { AUTH_ROUTES } from '../../constants';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'register', 'accepting', 'success', 'error'
  const [invitation, setInvitation] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No invitation token provided');
      return;
    }

    verifyInvitation(token);
  }, [searchParams]);

  const verifyInvitation = async (token) => {
    try {
      const response = await authAPI.verifyInvitation(token);
      
      if (response.data.success) {
        setInvitation(response.data.data);
        if (response.data.data.needsRegistration) {
          setStatus('register');
          setFormData(prev => ({ ...prev, email: response.data.data.email }));
        } else {
          // User already exists, just accept the invitation
          acceptInvitation(token);
        }
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Invalid or expired invitation');
      }
    } catch (error) {
      console.error('Invitation verification error:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Invalid or expired invitation');
    }
  };

  const acceptInvitation = async (token, userData = null) => {
    try {
      setStatus('accepting');
      
      const payload = { token };
      if (userData) {
        payload.firstName = userData.firstName;
        payload.lastName = userData.lastName;
        payload.password = userData.password;
      }
      
      const response = await authAPI.acceptInvitation(payload);
      
      if (response.data.success) {
        setStatus('success');
        setMessage('Invitation accepted successfully! You can now log in.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(AUTH_ROUTES.LOGIN);
        }, 3000);
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Accept invitation error:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to accept invitation');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const token = searchParams.get('token');
    await acceptInvitation(token, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password
    });
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Logo className="w-8 h-8" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Accept Invitation
          </h2>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <Loader className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
              <p className="text-gray-600">Verifying invitation...</p>
            </div>
          )}

          {status === 'register' && invitation && (
            <div>
              <div className="text-center mb-6">
                <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Complete Your Registration
                </h3>
                <p className="text-gray-600 mb-2">
                  You've been invited to join as a <span className="font-medium">{invitation.role.replace('_', ' ')}</span>
                </p>
                {invitation.project && (
                  <p className="text-gray-600">
                    Project: <span className="font-medium">{invitation.project.name}</span>
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    value={invitation.email}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="lastName"
                        required
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      name="password"
                      required
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Accept Invitation & Register
                </button>
              </form>
            </div>
          )}

          {status === 'accepting' && (
            <div className="text-center space-y-4">
              <Loader className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
              <p className="text-gray-600">Accepting invitation...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-green-900 mb-2">
                  Invitation Accepted!
                </h3>
                <p className="text-green-700 mb-4">{message}</p>
                <p className="text-sm text-gray-600">
                  Redirecting to login page in 3 seconds...
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <XCircle className="w-12 h-12 text-red-600 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-red-900 mb-2">
                  Invitation Error
                </h3>
                <p className="text-red-700 mb-4">{message}</p>
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Go to Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 