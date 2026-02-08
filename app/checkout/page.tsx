// app/checkout/page.tsx
// If not logged in → redirect to /login?callbackUrl=/checkout
// After login/signup → continue to checkout. If logged in → show checkout.

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useCartStore } from '@/hooks/useCartStore';
import { ordersApi, cartApi, authApi } from '@/services/api';
import { Button, Input, Card, Loading } from '@/components/ui';

const CHECKOUT_CALLBACK = '/login?callbackUrl=/checkout';

export default function CheckoutPage() {
  const router = useRouter();
  const initAuth = useAuthStore((state) => state.initAuth);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [processingGuest, setProcessingGuest] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    details: '',
    phone: '',
    city: '',
  });

  // 1. Auth Check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initAuth();
      setCheckingAuth(false);

      // Force logout if it's a legacy "Guest User"
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.name === 'Guest User' || user.email?.startsWith('guest')) {
            console.log('Clearing legacy guest account');
            clearAuth(); // Use store action
            // Force reload to update UI state immediately
            window.location.reload();
            return;
          }
        } catch (e) {
          // ignore
        }
      }

      // Load saved address
      const saved = localStorage.getItem('checkout_address');
      if (saved) {
        try {
          setShippingAddress(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved address');
        }
      }
    }
  }, [initAuth]);

  // Persist address changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkout_address', JSON.stringify(shippingAddress));
    }
  }, [shippingAddress]);

  const getProductId = (p: { _id?: string; id?: string } | undefined | null) => p?._id || p?.id || '';

  // 2. Cart Sync Logic - Improved
  const syncLocalCartToApi = async (): Promise<{ id: string | null, error?: string }> => {
    const { items: localItems } = useCartStore.getState();
    let lastCartId: string | null = null;
    let lastError: string | undefined;

    // Reverse to add items (optional, but sometimes helps with order)
    for (const item of localItems) {
      const productId = getProductId(item.product);
      if (!productId) {
        console.error('Invalid product in cart:', item);
        lastError = "Invalid product data";
        continue;
      }

      try {
        console.log(`Syncing product ${productId} to API cart...`);
        let cart = await cartApi.addToCart(productId);
        lastCartId = cart?._id ?? null;

        const qty = item.quantity ?? 1;
        if (qty > 1 && cart?.products) {
          const cartItem = cart.products.find(
            (cp: { product?: { _id?: string; id?: string } }) =>
              getProductId(cp.product) === productId
          );

          if (cartItem?._id) {
            // Update quantity
            cart = await cartApi.updateCartItemQuantity(cartItem._id, qty);
            lastCartId = cart?._id ?? lastCartId;
          }
        }
      } catch (e: any) {
        console.error('Sync cart item failed:', e);
        lastError = e.message || "Sync failed";
        // If 401, stop syncing and let auth logic handle it
        if (e.response?.status === 401) {
          throw new Error('AUTH_ERROR');
        }
      }
    }
    return { id: lastCartId, error: lastError };
  };

  const ensureCartId = async (): Promise<{ id: string | null, error?: string }> => {
    try {
      // Try to get existing cart
      let cart = await cartApi.getCart();

      // If no API cart (or it's empty) but we have local items, try to sync
      const { items: localItems } = useCartStore.getState();
      const hasLocalItems = localItems.length > 0;

      if (!cart && hasLocalItems) {
        console.log('No API cart found, syncing local items...');
        return await syncLocalCartToApi();
      }

      // If we synced, get cart again to be sure
      if (!cart) {
        cart = await cartApi.getCart();
      }

      return { id: cart?._id ?? null };
    } catch (err: any) {
      console.error('Error loading cart:', err);
      // If error is 404 (No cart for this user), and we have items, we MUST sync to create one
      if (err.message && err.message.includes('404')) {
        const { items: localItems } = useCartStore.getState();
        if (localItems.length > 0) {
          console.log('404 Cart not found, attempting to create by syncing...');
          return await syncLocalCartToApi();
        }
      }
      return { id: null, error: err.message };
    }
  };

  useEffect(() => {
    if (checkingAuth) return;

    const initCart = async () => {
      setCartLoading(true);
      const { id } = await ensureCartId();
      if (id) {
        setCartId(id);
      } else {
        console.warn('Could not ensure cart ID');
      }
      setCartLoading(false);
    };

    initCart();
  }, [checkingAuth]);

  // ... (lines 134-180 unchanged)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!shippingAddress.city) {
      setError('Please enter your city');
      return false;
    }
    if (!shippingAddress.phone) {
      setError('Please enter your phone number');
      return false;
    }
    if (!shippingAddress.details) {
      setError('Please enter your detailed address');
      return false;
    }
    return true;
  };

  const handleOrder = async (orderType: 'cash' | 'online') => {
    setError(null);
    if (!validateForm()) return;

    // Strict Login Requirement
    const token = localStorage.getItem('token');
    if (!token) {
      // Should be handled by UI, but double check
      setError('Please login to continue');
      return;
    }

    setLoading(true);
    let debugError = "";

    // Helper to ensure we have a valid cart ID
    const getVerifiedCartId = async (): Promise<string | null> => {
      try {
        const result = await ensureCartId();
        if (result.error) debugError = result.error;
        return result.id;
      } catch (e: any) {
        debugError = e.message;
        return null;
      }
    };

    const currentCartId = await getVerifiedCartId();

    if (!currentCartId) {
      setLoading(false);
      const { items } = useCartStore.getState();
      if (items.length === 0) {
        setError('السلة فارغة. أضف منتجات أولاً.');
      } else {
        setError(`فشل في معالجة الطلب. (${debugError || 'Unknown Error'})`);
      }
      return;
    }

    // Update state
    setCartId(currentCartId);

    // Place Order
    try {
      if (orderType === 'cash') {
        await ordersApi.createCashOrder(currentCartId, shippingAddress);
        clearCart();
        // Clear saved address on success? No, keep it for next time maybe.
        router.push('/orders?success=true');
      } else {
        const response = await ordersApi.createOnlinePaymentSession(currentCartId, shippingAddress);
        if (response.session && response.session.url) {
          window.location.href = response.session.url;
        }
      }
    } catch (err: any) {
      console.error('Order creation failed:', err);
      if (err.response?.status === 401) {
        setError('انتهت الجلسة. حاول مرة أخرى.');
        return;
      }
      setError(err.message || 'فشل إنشاء الطلب. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };


  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  const total = getTotalPrice();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Address Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleOrder('cash'); }} className="space-y-4">
              <Input
                label="City"
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
                required
                placeholder="Cairo"
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                required
                placeholder="01012345678"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="details"
                  value={shippingAddress.details}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      details: e.target.value,
                    })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Street, building number, apartment number, landmarks..."
                />
              </div>


              <div className="pt-4 space-y-3">
                {typeof window !== 'undefined' && !localStorage.getItem('token') ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-800 font-medium mb-3">
                      Please log in or create an account to complete your order.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent('/checkout')}`)}
                      >
                        Login
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => router.push(`/register?callbackUrl=${encodeURIComponent('/checkout')}`)}
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button
                      type="submit"
                      fullWidth
                      loading={loading}
                      size="lg"
                      disabled={cartLoading || loading}
                    >
                      {cartLoading ? 'Loading Cart...' : 'Cash on Delivery'}
                    </Button>

                    <Button
                      type="button"
                      fullWidth
                      variant="primary"
                      size="lg"
                      onClick={() => handleOrder('online')}
                      loading={loading}
                      disabled={cartLoading || loading}
                    >
                      {cartLoading ? 'Loading Cart...' : 'Online Payment'}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Number of Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{total.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary-600">{total.toFixed(2)} EGP</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">🔒 Secure Payment</p>
              <p>Your transaction is fully protected</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
