
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/hooks/useCartStore';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button, Card } from '@/_components/ui';
import { FaTrash, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center py-20">
          <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start adding some products!</p>
          <Button onClick={() => router.push('/products')} size="lg">
            Browse Products
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product;
            const productImage = product.imageCover || product.image || (product.images && product.images[0]);

            return (
              <Card key={product._id || product.id}>
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    {productImage && (
                      <Image
                        src={productImage}
                        alt={product.title}
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                      />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </p>
                    <p className="text-lg font-bold text-primary-600">
                      {product.price.toFixed(2)} EGP
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(product._id || product.id || '')}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash />
                    </button>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(
                          product._id || product.id || '',
                          item.quantity - 1
                        )}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(
                          product._id || product.id || '',
                          item.quantity + 1
                        )}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items ({items.length})</span>
                <span>{total.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary-600">{total.toFixed(2)} EGP</span>
                </div>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>

            <button
              onClick={() => router.push('/products')}
              className="w-full mt-3 text-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              Continue Shopping
            </button>

            {!isAuthenticated && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-1">Sign in to checkout</p>
                <p className="text-xs">You'll need to sign in to complete your purchase</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
