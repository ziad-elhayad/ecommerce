// app/categories/[category]/page.tsx
// Param can be category _id (MongoDB id) or slug from Route API

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productsApi } from '@/services/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { Loading, Button } from '@/components/ui';
import { FaArrowLeft } from 'react-icons/fa';

/** MongoDB ObjectId is 24 hex chars */
function isMongoId(value: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(value);
}

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const param = params.category as string;
        if (!param) {
          setLoading(false);
          return;
        }

        const categories = await productsApi.getCategoriesDetailed();
        let categoryId: string;
        const byId = categories.find((c) => c._id === param);
        const bySlug = categories.find((c) => c.slug === param);

        if (byId) {
          categoryId = byId._id;
          setCategoryName(byId.name);
        } else if (bySlug) {
          categoryId = bySlug._id;
          setCategoryName(bySlug.name);
        } else if (isMongoId(param)) {
          categoryId = param;
          const cat = categories.find((c) => c._id === param);
          if (cat) setCategoryName(cat.name);
        } else {
          setCategoryName(param);
          setError('Category not found');
          setProducts([]);
          setLoading(false);
          return;
        }

        const list = await productsApi.getByCategory(categoryId);
        setProducts(list);
      } catch (err: unknown) {
        console.error('Error fetching category products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    if (params.category) {
      fetchProducts();
    }
  }, [params.category]);

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
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button onClick={() => router.push('/categories')}>
            <FaArrowLeft className="mr-2" />
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.push('/categories')}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
      >
        <FaArrowLeft />
        Back to Categories
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryName || 'Products'}
        </h1>
        <p className="text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">No products found in this category</p>
          <Button onClick={() => router.push('/categories')}>
            Browse Other Categories
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
