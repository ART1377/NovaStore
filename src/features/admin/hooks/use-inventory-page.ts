// src/features/admin/hooks/use-inventory-page.ts
'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';
import { LOW_STOCK_THRESHOLD } from '@/constants/constants';
import { numericInputValue } from '@/lib/utils';
import { useAdminInventory, useAdminInventoryActions } from './use-admin';

type InventoryFilter = 'ALL' | 'LOW' | 'OUT';
const STOCK_SCHEMA = z.string().regex(/^\d+$/, 'موجودی باید عدد صحیح باشد.').refine((value) => Number(value) <= 1_000_000, 'موجودی نمی‌تواند بیشتر از ۱٬۰۰۰٬۰۰۰ باشد.');

export function useInventoryPage() {
  const { data = [], isLoading } = useAdminInventory();
  const { update } = useAdminInventoryActions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InventoryFilter>('ALL');
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});

  const saveStock = (variantId: string, value: string) => {
    const normalizedValue = numericInputValue(value);
    const result = STOCK_SCHEMA.safeParse(normalizedValue);
    if (!result.success) {
      setStockErrors((current) => ({ ...current, [variantId]: result.error.issues[0]?.message ?? 'موجودی نامعتبر است.' }));
      return;
    }
    setStockErrors((current) => {
      const next = { ...current };
      delete next[variantId];
      return next;
    });
    update.mutate({ variantId, stock: Number(normalizedValue) });
  };

  const list = useMemo(() => data.filter((item) => {
    const matchesFilter = filter === 'ALL' || (filter === 'LOW' && item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD) || (filter === 'OUT' && item.stock === 0);
    const query = search.trim().toLowerCase();
    return matchesFilter && `${item.product.name} ${item.sku} ${item.name}`.toLowerCase().includes(query);
  }), [data, filter, search]);

  const total = data.reduce((sum, item) => sum + item.stock, 0);
  const out = data.filter((item) => item.stock === 0).length;
  const low = data.filter((item) => item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD).length;

  return { data, list, isLoading, update, search, filter, stockErrors, total, out, low, setSearch, setFilter, saveStock };
}
