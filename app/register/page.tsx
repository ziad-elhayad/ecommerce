// app/register/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button, Input, Card, Loading } from '@/_components/ui';
import { Suspense } from 'react';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const callbackUrl = searchParams.get('callbackUrl') || '';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (formData.password !== formData.rePassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Phone: 11 digits, Egyptian format
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      setError('phone number must be egyption');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        phone: phoneDigits,
      };
      const response = await authApi.register(payload);

      if (response.token) {
        const user = response.user ?? { email: formData.email, name: formData.name } as any;
        setAuth(user, response.token);
        router.push(callbackUrl || '/');
      } else {
        const redirect = callbackUrl
          ? `/login?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}`
          : '/login?registered=true';
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign up to start shopping</p>
        </div>

        <Card className="p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="01012345678"
              helperText="Egyptian phone number (11 digits)"
              maxLength={11}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              helperText="At least 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="rePassword"
              value={formData.rePassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Button type="submit" fullWidth loading={loading} className="h-12 text-lg">
              Create Account
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <Link
                href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login'}
                className="text-primary-600 hover:text-primary-500 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center leading-relaxed">
              By creating an account, you agree to our <br />
              <Link href="#" className="hover:underline">Terms of Service</Link> and <Link href="#" className="hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loading size="lg" text="Loading registration..." />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
