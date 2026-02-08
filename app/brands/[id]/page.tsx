// app/brands/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productsApi, brandsApi } from '@/services/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { Loading, Button } from '@/components/ui';
import { FaArrowLeft } from 'react-icons/fa';

export default function BrandProductsPage() {
  const params = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get brand details
        const brand = await brandsApi.getById(params.id as string);
        setBrandName(brand?.name ?? 'Brand');
        
        // Get all products and filter by brand
        const allProducts = await productsApi.getAll();
        const brandProducts = allProducts.filter(
          (p) => p.brand && p.brand._id === params.id
        );
        setProducts(brandProducts);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center py-20">
          <Loading size="lg" text="Loading products..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push('/brands')}>
            Back to Brands
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.push('/brands')}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
      >
        <FaArrowLeft />
        Back to Brands
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {brandName}
        </h1>
        <p className="text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found for this brand</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
