// src/features/catalog/hooks/use-product-filters-url.ts
'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SEARCH_DEBOUNCE_MS } from '@/constants/constants';
import type { ProductFilters } from '../types/catalog-types';

export function useProductFiltersUrl() {
  const params = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(params.get('search') ?? '');

  useEffect(() => {
    setSearch(params.get('search') ?? '');
  }, [params]);

  const filters = useMemo<ProductFilters>(
    () => ({
      search: params.get('search') || undefined,
      category: params.get('category') || undefined,
      brand: params.get('brand') || undefined,
      minPrice: params.get('minPrice') || undefined,
      maxPrice: params.get('maxPrice') || undefined,
      available: params.get('available') || undefined,
      discounted: params.get('discounted') || undefined,
      rating: params.get('rating') || undefined,
      sort: params.get('sort') || 'newest',
      page: Number(params.get('page') || 1),
    }),
    [params],
  );

  useEffect(() => {
    const value = search.trim();
    const current = (params.get('search') ?? '').trim();
    if (value === current) return;

    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      value ? next.set('search', value) : next.delete('search');
      next.delete('page');
      const query = next.toString();
      startTransition(() =>
        router.replace(query ? `/products?${query}` : '/products'),
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [params, router, search]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    value ? next.set(key, value) : next.delete(key);
    if (key !== 'page') next.delete('page');
    const query = next.toString();
    startTransition(() =>
      router.replace(query ? `/products?${query}` : '/products'),
    );
  };

  const setPriceRange = (minPrice: string, maxPrice: string) => {
    const next = new URLSearchParams(params.toString());
    minPrice ? next.set('minPrice', minPrice) : next.delete('minPrice');
    maxPrice ? next.set('maxPrice', maxPrice) : next.delete('maxPrice');
    next.delete('page');
    const query = next.toString();
    startTransition(() =>
      router.replace(query ? `/products?${query}` : '/products'),
    );
  };

  const clear = () => {
    setSearch('');
    startTransition(() => router.replace('/products'));
  };

  return { filters, search, setSearch, setParam, setPriceRange, clear, isPending };
}
