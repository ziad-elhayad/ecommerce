// components/ProductCard.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Card, Button } from './ui';
import { useCartStore } from '@/hooks/useCartStore';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product as any);
    setTimeout(() => setIsAdding(false), 500);
  };

  const productId = product._id || product.id;
  const displayPrice = product.priceAfterDiscount || product.price;
  const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;

  return (
    <Link href={`/products/${productId}`}>
      <Card hover className="h-full flex flex-col">
        <div className="relative w-full aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-contain p-4 hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              SALE
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.category.name}
          </p>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {product.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>
          
          <div className="flex items-center gap-1 mb-3">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-medium text-gray-700">
              {product.ratingsAverage?.toFixed(1) || 'N/A'}
            </span>
            <span className="text-xs text-gray-500">
              ({product.ratingsQuantity || 0})
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
              <span className={`text-2xl font-bold text-primary-600 ${hasDiscount ? '' : ''}`}>
                ${displayPrice.toFixed(2)}
              </span>
            </div>
            
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
