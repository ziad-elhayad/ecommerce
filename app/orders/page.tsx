// app/orders/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { ordersApi } from '@/services/api';
import { Card, Loading, Button } from '@/components/ui';
import { FaCheckCircle, FaTruck, FaClock, FaBox } from 'react-icons/fa';

interface Order {
  _id: string;
  cartItems: any[];
  totalOrderPrice: number;
  paymentMethodType: string;
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const success = searchParams.get('success');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching orders...');
        const data = await ordersApi.getUserOrders();

        console.log('Orders received:', data);
        setOrders(data || []);
      } catch (err: any) {
        console.error('Orders fetch error:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center py-20">
          <Loading size="lg" text="Loading orders..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
          <FaCheckCircle className="text-2xl" />
          <div>
            <p className="font-semibold">Order placed successfully!</p>
            <p className="text-sm">We'll contact you soon to confirm your order</p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-yellow-900 mb-1">Unable to load orders</p>
              <p className="text-sm text-yellow-700 mb-3">{error}</p>
              <p className="text-sm text-yellow-700">
                This might be because:
              </p>
              <ul className="text-sm text-yellow-700 list-disc list-inside mt-2 space-y-1">
                <li>You haven't placed any orders yet</li>
                <li>Your session has expired (try logging in again)</li>
                <li>The orders API requires additional authentication</li>
              </ul>
              <div className="mt-4 flex gap-3">
                <Button
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push('/products')}
                >
                  Browse Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!error && orders.length === 0 && (
        <Card className="text-center py-16">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders</p>
          <Button onClick={() => router.push('/products')} size="lg">
            Browse Products
          </Button>
        </Card>
      )}

      {!error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-900">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                  {order.isPaid ? (
                    <span className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <FaCheckCircle />
                      Paid
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      <FaClock />
                      Pending Payment
                    </span>
                  )}
                  {order.isDelivered ? (
                    <span className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      <FaCheckCircle />
                      Delivered
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      <FaTruck />
                      In Transit
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">
                    {order.paymentMethodType === 'cash' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-primary-600">
                    {order.totalOrderPrice.toFixed(2)} EGP
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Shipping Address:</p>
                {order.shippingAddress && order.shippingAddress.city ? (
                  <>
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.details}
                    </p>
                    <p className="text-gray-600">
                      📱 {order.shippingAddress.phone}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">No shipping address available</p>
                )}
              </div>

              {order.cartItems && order.cartItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Items: {order.cartItems.length}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
