// app/wishlist/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { productsApi } from '@/services/api/products';
import { Button, Card, Loading } from '@/_components/ui';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useCartStore } from '@/hooks/useCartStore';

export default function WishlistPage() {
  const router = useRouter();
  const { items: wishlistIds, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      try {
        setLoading(true);

        if (wishlistIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Fetch products individually by ID (more reliable than fetching ALL)
        const productPromises = wishlistIds.map(id => productsApi.getById(id));
        const responses = await Promise.all(productPromises);
        const validProducts = responses.filter(p => p !== null);

        setProducts(validProducts);
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistProducts();
  }, [wishlistIds]);

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const getProductImage = (product: any) => {
    return product.imageCover || product.image || product.images?.[0] || '/placeholder.jpg';
  };

  const getProductId = (product: any) => {
    return product._id || product.id || '';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center py-20">
          <Loading size="lg" text="Loading wishlist..." />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center py-20">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save items you love for later!</p>
          <Button onClick={() => router.push('/products')} size="lg">
            Browse Products
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        My Wishlist ({products.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const productId = getProductId(product);
          return (
            <Card key={productId} className="relative">
              <button
                onClick={() => handleRemove(productId)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Remove from wishlist"
              >
                <FaTrash className="text-sm" />
              </button>

              <div
                className="relative w-full aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => router.push(`/products/${productId}`)}
              >
                <Image
                  src={getProductImage(product)}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              <h3
                className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer"
                onClick={() => router.push(`/products/${productId}`)}
              >
                {product.title}
              </h3>

              <p className="text-xl font-bold text-primary-600 mb-4">
                {product.price.toFixed(2)} EGP
              </p>

              <Button
                fullWidth
                size="sm"
                onClick={() => handleAddToCart(product)}
                className="gap-2"
              >
                <FaShoppingCart />
                Add to Cart
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
