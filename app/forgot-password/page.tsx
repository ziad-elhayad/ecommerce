// app/forgot-password/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import { Button, Input, Card } from '@/_components/ui';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess('Reset code sent to your email');
      setStep('code');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await authApi.verifyResetCode({ resetCode });
      setSuccess('Code verified successfully');
      setStep('newPassword');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({ email, newPassword });
      setSuccess('Password changed successfully');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'email' && 'Enter your email to receive a reset code'}
            {step === 'code' && 'Enter the code sent to your email'}
            {step === 'newPassword' && 'Enter your new password'}
          </p>
        </div>

        <Card className="p-8 shadow-xl">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {success}
            </div>
          )}

          {/* Step 1: Enter Email */}
          {step === 'email' && (
            <form onSubmit={handleSendResetCode} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />

              <Button type="submit" fullWidth loading={loading} className="h-12 text-lg">
                Send Reset Code
              </Button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Remember your password?{' '}
                <Link href="/login" className="text-primary-600 dark:text-primary-500 font-semibold hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: Enter Reset Code */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <Input
                label="Reset Code"
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                placeholder="Enter 6-digit code"
                maxLength={6}
              />

              <Button type="submit" fullWidth loading={loading} className="h-12 text-lg">
                Verify Code
              </Button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 font-medium transition-colors"
              >
                Back to email
              </button>
            </form>
          )}

          {/* Step 3: Enter New Password */}
          {step === 'newPassword' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                helperText="At least 6 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />

              <Button type="submit" fullWidth loading={loading} className="h-12 text-lg">
                Update Password
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
