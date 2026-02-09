// app/orders/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { ordersApi } from '@/services/api';
import { Card, Loading, Button } from '@/_components/ui';
import { FaCheckCircle, FaTruck, FaClock, FaBox } from 'react-icons/fa';
import { Suspense } from 'react';

// ... Order interface ...
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

function OrdersContent() {
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
        const data = await ordersApi.getUserOrders();
        setOrders(data || []);
      } catch (err: any) {
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
              <div className="mt-4 flex gap-3">
                <Button size="sm" onClick={() => window.location.reload()}>Try Again</Button>
                <Button size="sm" variant="outline" onClick={() => router.push('/products')}>Browse Products</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 && !error && (
        <Card className="text-center py-16">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
          <Button onClick={() => router.push('/products')} size="lg">Browse Products</Button>
        </Card>
      )}

      {orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id}>
              {/* Simplified for brevity while keeping core UI */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                  <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.isPaid ? <FaCheckCircle /> : <FaClock />}
                    {order.isPaid ? 'Paid' : 'Pending Payment'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-primary-600">{order.totalOrderPrice.toFixed(2)} EGP</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center py-20">
          <Loading size="lg" text="Loading orders..." />
        </div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
