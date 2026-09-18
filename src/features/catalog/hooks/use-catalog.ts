// src/features/catalog/hooks/use-catalog.ts
'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { catalogService } from '../api/catalog.api';
import type { Product, ProductFilters } from '../types/catalog-types';
import { QUERY_KEYS } from '@/lib/query-keys';
import { QUERY_STALE_TIME_MS } from '@/constants/constants';
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.products(filters),
    queryFn: ({ signal }) => catalogService.getProducts(filters, signal),
    staleTime: QUERY_STALE_TIME_MS,
    placeholderData: keepPreviousData,
    retry: 1,
  });
}
export function useProduct(slug: string, initialData?: Product) {
  return useQuery({
    queryKey: QUERY_KEYS.product(slug),
    queryFn: ({ signal }) => catalogService.getProduct(slug, signal),
    enabled: !!slug,
    initialData,
    staleTime: QUERY_STALE_TIME_MS,
    retry: 1,
  });
}
