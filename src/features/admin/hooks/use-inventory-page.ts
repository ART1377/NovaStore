// src/features/admin/hooks/use-inventory-page.ts
'use client';

import { LOW_STOCK_THRESHOLD } from '@/constants/constants';
import { numericInputValue } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { useAdminInventory, useAdminInventoryActions } from './use-admin';

type InventoryFilter = 'ALL' | 'LOW' | 'OUT';

export function useInventoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminInventory({ page });
  const { update } = useAdminInventoryActions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InventoryFilter>('ALL');
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});

  const items = useMemo(() => data?.items ?? [], [data?.items]);

  const list = useMemo(
    () =>
      items.filter((item) => {
        const matchesFilter =
          filter === 'ALL' ||
          (filter === 'LOW' &&
            item.stock > 0 &&
            item.stock <= LOW_STOCK_THRESHOLD) ||
          (filter === 'OUT' && item.stock === 0);
        const query = search.trim().toLowerCase();
        return (
          matchesFilter &&
          `${item.product.name} ${item.sku} ${item.name}`
            .toLowerCase()
            .includes(query)
        );
      }),
    [items, filter, search],
  );

  const saveStock = (variantId: string, value: string) => {
    const normalized = numericInputValue(value);
    if (!/^\d+$/.test(normalized) || Number(normalized) > 1_000_000) {
      setStockErrors((current) => ({
        ...current,
        [variantId]: 'موجودی باید عدد صحیح بین ۰ تا ۱٬۰۰۰٬۰۰۰ باشد.',
      }));
      return;
    }
    setStockErrors((current) => {
      const next = { ...current };
      delete next[variantId];
      return next;
    });
    update.mutate({ variantId, stock: Number(normalized) });
  };

  const total = items.reduce((sum, item) => sum + item.stock, 0);
  const out = items.filter((item) => item.stock === 0).length;
  const low = items.filter(
    (item) => item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD,
  ).length;

  return {
    data,
    list,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    update,
    search,
    filter,
    page,
    setPage,
    stockErrors,
    total,
    out,
    low,
    setSearch,
    setFilter,
    saveStock,
  };
}
