// src/features/compare/hooks/use-compare-products.ts
'use client';

import { useQueries } from '@tanstack/react-query';
import { catalogService } from '@/features/catalog/api/catalog.api';
import type { Product } from '@/features/catalog/types/catalog-types';
import { QUERY_KEYS } from '@/lib/query-keys';
import { useCompare } from './use-compare';

export function useCompareProducts() {
  const { items } = useCompare();
  const queries = useQueries({
    queries: items.map((slug) => ({
      queryKey: QUERY_KEYS.compareProduct(slug),
      queryFn: () => catalogService.getProduct(slug),
    })),
  });

  const products = queries
    .map((query) => query.data)
    .filter((product): product is Product => Boolean(product));

  return {
    products,
    isLoading: queries.some((query) => query.isLoading),
  };
}
