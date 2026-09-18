// src/features/catalog/components/products-page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PackageSearch, Search, Sparkles, X } from 'lucide-react';
import { useProducts } from '../hooks/use-catalog';
import { useProductFiltersUrl } from '../hooks/use-product-filters-url';
import { PRODUCT_GRID_SKELETON_COUNT } from '@/constants/constants';
import { ProductGrid } from './product-grid';
import { ProductFilters } from './product-filters';
import { SearchSuggestions } from './search-suggestions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getClientErrorMessage } from '@/lib/client-error';
import { QueryError } from '@/components/shared/query-state';

export function ProductsPage() {
  const reducedMotion = useReducedMotion() === true;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    filters,
    search,
    setSearch,
    setParam,
    setPriceRange,
    clear,
    isPending,
  } = useProductFiltersUrl();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useProducts(filters);

  const activeFilters = [
    filters.search
      ? { label: `جستجو: ${filters.search}`, key: 'search' }
      : null,
    filters.category
      ? { label: `دسته: ${filters.category}`, key: 'category' }
      : null,
    filters.brand ? { label: `برند: ${filters.brand}`, key: 'brand' } : null,
    filters.minPrice
      ? { label: `از ${filters.minPrice}`, key: 'minPrice' }
      : null,
    filters.maxPrice
      ? { label: `تا ${filters.maxPrice}`, key: 'maxPrice' }
      : null,
    filters.available === 'true'
      ? { label: 'فقط موجود', key: 'available' }
      : null,
    filters.discounted === 'true'
      ? { label: 'تخفیف‌دار', key: 'discounted' }
      : null,
    filters.rating
      ? { label: `${filters.rating}★ به بالا`, key: 'rating' }
      : null,
  ].filter((item): item is { label: string; key: string } => Boolean(item));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <motion.div
        className="border-nova-line bg-nova-surface mb-7 rounded-[30px] border p-5 shadow-[0_18px_50px_-38px_rgba(17,24,39,.4)] md:p-7"
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={mounted ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.985 }}
        transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="bg-nova-hover text-nova-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold">
              <Sparkles size={13} /> کشف انتخاب بهتر
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              فروشگاه
            </h1>
            <p className="text-nova-primary mt-2 text-sm leading-7">
              بر اساس برند، قیمت، امتیاز و وضعیت موجودی دقیقاً همان چیزی را پیدا
              کن که می‌خواهی.
            </p>
          </div>
          <div className="w-full lg:w-[440px]">
            <div className="relative">
              <Search
                className="text-nova-muted absolute top-1/2 right-3 -translate-y-1/2"
                size={18}
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جستجوی محصول، برند یا دسته‌بندی"
                className="h-12 pr-10 pl-10"
                aria-label="جستجوی محصولات"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-nova-muted hover:bg-nova-soft absolute top-1/2 left-3 -translate-y-1/2 rounded-full p-1"
                  aria-label="پاک کردن جستجو"
                >
                  <X size={15} />
                </button>
              )}
              <SearchSuggestions value={search} />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mb-4 lg:hidden"
        initial={{ opacity: 0, y: 18 }}
        animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <ProductFilters
          filters={filters}
          categories={data?.categories ?? []}
          brands={data?.brands ?? []}
          onChange={setParam}
          onRangeChange={setPriceRange}
          onClear={clear}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: 24 }}
          animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
          transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductFilters
            filters={filters}
            categories={data?.categories ?? []}
            brands={data?.brands ?? []}
            onChange={setParam}
            onRangeChange={setPriceRange}
            onClear={clear}
          />
        </motion.div>

        <motion.section
          className="min-w-0"
          initial={{ opacity: 0, y: 22 }}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setParam(item.key, '')}
                >
                  <Badge className="gap-1">
                    {item.label}
                    <X size={12} />
                  </Badge>
                </button>
              ))}
            </div>
            <span className="text-nova-muted text-xs">
              {isFetching && !isLoading
                ? 'در حال به‌روزرسانی…'
                : `${data?.total ?? 0} نتیجه`}
            </span>
          </div>

          {isError ? (
            <QueryError
              message={getClientErrorMessage(error, 'دریافت محصولات با مشکل مواجه شد.')}
              onRetry={() => refetch()}
            />
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: PRODUCT_GRID_SKELETON_COUNT }).map((_, index) => (
                <Skeleton key={index} className="aspect-[.78] rounded-3xl" />
              ))}
            </div>
          ) : data?.products.length ? (
            <>
              <div
                className={
                  isPending || isFetching ? 'opacity-70 transition-opacity' : ''
                }
              >
                <ProductGrid products={data.products} animated />
              </div>
              <div className="mt-10 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  disabled={filters.page <= 1 || isPending}
                  onClick={() => setParam('page', String(filters.page - 1))}
                >
                  قبلی
                </Button>
                <span className="bg-nova-surface min-w-20 rounded-xl px-4 py-2 text-center text-sm font-bold shadow-sm">
                  {data.page}
                </span>
                <Button
                  variant="outline"
                  disabled={!data.hasMore || isPending}
                  onClick={() => setParam('page', String(filters.page + 1))}
                >
                  بعدی
                </Button>
              </div>
            </>
          ) : (
            <div className="border-nova-line bg-nova-surface rounded-3xl border px-6 py-24 text-center">
              <PackageSearch
                size={44}
                strokeWidth={1.7}
                className="text-nova-muted mx-auto"
              />
              <h2 className="mt-4 text-xl font-black">محصولی پیدا نشد</h2>
              <p className="text-nova-primary mx-auto mt-2 max-w-xl text-sm leading-7">
                فیلترها را کمی بازتر کن یا عبارت دیگری جستجو کن.
              </p>
              <Button className="mt-5" onClick={clear}>
                حذف فیلترها
              </Button>
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}
