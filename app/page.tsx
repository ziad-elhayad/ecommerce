// app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { productsApi } from '@/services/api';
import { Product } from '@/types';
import { ProductCard } from '@/_components/ProductCard';
import { Button, Loading } from '@/_components/ui';
import { FaArrowRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch data independently so one failure doesn't block the other
        try {
          const productsData = await productsApi.getAll(8);
          setProducts(productsData);
        } catch (e) {
          console.error('Failed to load products', e);
        }

        try {
          const categoriesData = await productsApi.getCategoriesDetailed();
          setCategories(categoriesData);
        } catch (e) {
          console.error('Failed to load categories', e);
        }
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-600 dark:bg-primary-700 text-white py-16 lg:py-24 transition-colors duration-500">
        {/* Advanced Professional Background Layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main Mesh Gradient Layer */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_30%,#fee2e2_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#991b1b_0%,transparent_50%)]"></div>

          {/* Animated Glass Orbs */}
          <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-white/10 blur-[100px] animate-[pulse_8s_infinite_ease-in-out]"></div>
          <div className="absolute bottom-[-15%] right-[-5%] w-[35rem] h-[35rem] rounded-full bg-black/20 blur-[100px] animate-[pulse_10s_infinite_ease-in-out]"></div>

          {/* Premium Noise/Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          {/* Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(30deg, #fff 12%, transparent 12.5%, transparent 87%, #fff 87.5%, #fff), linear-gradient(150deg, #fff 12%, transparent 12.5%, transparent 87%, #fff 87.5%, #fff), linear-gradient(30deg, #fff 12%, transparent 12.5%, transparent 87%, #fff 87.5%, #fff), linear-gradient(150deg, #fff 12%, transparent 12.5%, transparent 87%, #fff 87.5%, #fff), linear-gradient(60deg, #fff 25%, transparent 25.5%, transparent 75%, #fff 75%, #fff), linear-gradient(60deg, #fff 25%, transparent 25.5%, transparent 75%, #fff 75%, #fff)', backgroundSize: '80px 140px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold mb-8 animate-bounce shadow-lg backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              New Season Arrival
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight text-white drop-shadow-md">
              Welcome to <span className="text-white underline decoration-white/30 underline-offset-8">ShopHub</span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-primary-50 max-w-2xl leading-relaxed font-medium">
              Experience the future of online shopping. Discover curated collections and premium products at unbeatable prices.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/products">
                <Button variant="secondary" size="lg" className="px-10 py-6 rounded-2xl bg-white text-black dark:text-primary-600 hover:bg-primary-50 border-none shadow-2xl hover:-translate-y-1 transition-all duration-300 gap-2 text-lg font-bold">
                  Shop Now
                  <FaArrowRight className="text-sm" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg" className="px-10 py-6 rounded-2xl border-2 border-white/50 text-white hover:bg-white/10 transition-all duration-300 text-lg font-semibold backdrop-blur-sm">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section with Swiper */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <Link href="/categories">
              <Button variant="outline" size="sm" className="gap-2">
                View All
                <FaArrowRight />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" text="Loading categories..." />
            </div>
          ) : categories.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={2}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 3,
                },
                768: {
                  slidesPerView: 4,
                },
                1024: {
                  slidesPerView: 6,
                },
              }}
              className="pb-12"
            >
              {categories.map((category) => (
                <SwiperSlide key={category._id}>
                  <Link href={`/categories/${encodeURIComponent(category._id)}`}>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center cursor-pointer group border border-transparent dark:border-gray-800">
                      <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
          <Link href="/products">
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <FaArrowRight />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loading size="lg" text="Loading products..." />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-950 py-16 transition-colors duration-300 border-t dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400">On orders over 500 EGP</p>
            </div>

            <div className="text-center group">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-400">100% secure transactions</p>
            </div>

            <div className="text-center group">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Easy Returns</h3>
              <p className="text-gray-600 dark:text-gray-400">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
