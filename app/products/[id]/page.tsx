// app/products/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { productsApi } from '@/services/api';
import { Product } from '@/types';
import { Button, Card, Loading } from '@/components/ui';
import { useCartStore } from '@/hooks/useCartStore';
import { FaStar, FaShoppingCart, FaArrowLeft, FaHeart } from 'react-icons/fa';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productId = params.id as string;
        console.log('Fetching product with ID:', productId);
        
        const data = await productsApi.getById(productId);
        console.log('Product data received:', data);
        
        setProduct(data);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addItem(product as any);
    }
    
    // Redirect to checkout after adding to cart
    setTimeout(() => {
      setIsAdding(false);
      router.push('/checkout');
    }, 500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center py-20">
          <Loading size="lg" text="Loading product..." />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <p className="text-red-500 text-lg mb-4">{error || 'Product not found'}</p>
          <Button onClick={() => router.push('/products')}>
            <FaArrowLeft className="mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.imageCover 
    ? [product.imageCover] 
    : [];

  const categoryName = typeof product.category === 'object' 
    ? product.category.name 
    : product.category;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/products')}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
      >
        <FaArrowLeft />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
            <Image
              src={images[selectedImage] || product.imageCover || '/placeholder.jpg'}
              alt={product.title}
              fill
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary-600'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} - ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              {categoryName}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span className="font-semibold text-gray-900">
                  {product.ratingsAverage?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <span className="text-gray-500">
                ({product.ratingsQuantity || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-primary-600">
                {product.price.toFixed(2)} EGP
              </p>
            </div>

            {/* Stock Status */}
            {product.quantity !== undefined && (
              <div className="mb-6">
                {product.quantity > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    In Stock ({product.quantity} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Brand */}
          {product.brand && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">Brand</p>
              <p className="font-semibold text-gray-900">{product.brand.name}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                -
              </button>
              <span className="w-16 text-center font-semibold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1 gap-2"
              loading={isAdding}
            >
              <FaShoppingCart />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <FaHeart />
              Wishlist
            </Button>
          </div>

          {/* Additional Info */}
          <Card className="bg-gray-50 border-none">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Free shipping on orders over 500 EGP</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">30-day return policy</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Secure payment</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
