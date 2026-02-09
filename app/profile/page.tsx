
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useCartStore } from '@/hooks/useCartStore';
import { Card, Button } from '@/_components/ui';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaShoppingBag } from 'react-icons/fa';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { items, getTotalPrice } = useCartStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">
                    {user.name.firstname} {user.name.lastname}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaUser className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium text-gray-900">{user.username}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.address && (
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 text-xl mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">
                      {user.address.number} {user.address.street}
                      <br />
                      {user.address.city}, {user.address.zipcode}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              {/* <Button variant="outline" fullWidth>
                Edit Profile
              </Button> */}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Actions
            </h2>
            <div className="space-y-3">
              <Button variant="danger" fullWidth onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shopping Summary
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Items in Cart</span>
                <span className="font-bold text-primary-600">{items.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cart Total</span>
                <span className="font-bold text-primary-600">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button fullWidth onClick={() => router.push('/cart')}>
                View Cart
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Links
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/products')}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                Browse Products
              </button>
              <button
                onClick={() => router.push('/categories')}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                Categories
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                Shopping Cart
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
