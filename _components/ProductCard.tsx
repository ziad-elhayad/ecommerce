// components/ProductCard.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Card, Button } from './ui';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { wishlistApi } from '@/services/api';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/hooks/useCartStore';
import { useHydration } from '@/hooks/useHydration';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = React.useState(false);
  const { isInWishlist, addItem: addToStore, removeItem: removeFromStore } = useWishlistStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrated = useHydration();

  // ... (handlers remain same)

  const toggleWishlist = async () => {
    // ... same logic
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (isInWishlist(productId)) {
        removeFromStore(productId);
        await wishlistApi.removeFromWishlist(productId);
      } else {
        addToStore(productId);
        await wishlistApi.addToWishlist(productId);
      }
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product as any);
    setTimeout(() => setIsAdding(false), 500);
  };

  // Safe access to category name
  const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
  const productImage = product.imageCover || product.image || (product.images && product.images[0]);
  const productId = product._id || product.id;
  const priceEGP = product.price;

  // Render
  return (
    <Link href={`/products/${productId}`}>
      <Card hover className="h-full flex flex-col">
        {/* ... Image & Details ... */}
        <div className="relative w-full aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
          {productImage && (
            <Image
              src={productImage}
              alt={product.title}
              fill
              className="object-contain p-4 hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>

        <div className="flex flex-col flex-grow">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {categoryName}
          </p>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {product.title}
          </h3>

          {/* ... Description ... */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>

          <div className="flex items-center gap-1 mb-3">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-medium text-gray-700">
              {product.ratingsAverage?.toFixed(1) || product.rating?.rate?.toFixed(1) || 'N/A'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-600">
              {priceEGP.toFixed(2)} EGP
            </span>
          </div>

          <div className="flex gap-2">
            {/* Only render heart icon logic after hydration to avoid mismatch */}
            <Button
              variant="outline"
              size="sm"
              className={`p-2 ${hydrated && isInWishlist(productId) ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400'}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist();
              }}
            >
              <FaHeart className={hydrated && isInWishlist(productId) ? 'fill-current' : ''} />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              loading={isAdding}
              className="gap-2"
            >
              <FaShoppingCart />
              Add
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};
