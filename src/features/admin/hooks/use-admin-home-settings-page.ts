// src/features/admin/hooks/use-admin-home-settings-page.ts
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAdminHomeActions, useAdminHomeSettings } from './use-admin';
import type { AdminHomePlacementSlot } from '../types/admin-types';

export const SLOT_META: Record<AdminHomePlacementSlot, { label: string; title: string; description: string; limit: number }> = {
  HERO_PRODUCT: { label: 'Hero', title: 'محصول اصلی Hero', description: 'محصولی که در کارت بزرگ ابتدای صفحه اصلی نمایش داده می‌شود.', limit: 1 },
  FEATURED_PRODUCTS: { label: 'منتخب', title: 'محصولات منتخب', description: 'محصولات بخش انتخاب‌های اصلی صفحه اصلی.', limit: 4 },
  DISCOUNTED_PRODUCTS: { label: 'پیشنهاد ویژه', title: 'محصولات تخفیف‌دار', description: 'محصولات بخش پیشنهاد ویژه را انتخاب و مرتب کنید.', limit: 4 },
  BEST_SELLERS: { label: 'پرفروش', title: 'پرفروش‌ترین‌ها', description: 'با انتخاب دستی، ترتیب خودکار فروش با این لیست جایگزین می‌شود.', limit: 5 },
  NEWEST_PRODUCTS: { label: 'جدیدترین', title: 'تازه‌رسیده‌ها', description: 'با انتخاب دستی، ترتیب خودکار جدیدترین‌ها با این لیست جایگزین می‌شود.', limit: 8 },
};

export const HOME_SLOTS = Object.keys(SLOT_META) as AdminHomePlacementSlot[];
type Selected = Record<AdminHomePlacementSlot, string[]>;
const EMPTY_SELECTION: Selected = {
  HERO_PRODUCT: [], FEATURED_PRODUCTS: [], DISCOUNTED_PRODUCTS: [], BEST_SELLERS: [], NEWEST_PRODUCTS: [],
};

export function useAdminHomeSettingsPage() {
  const query = useAdminHomeSettings();
  const { updatePlacement } = useAdminHomeActions();
  const [selected, setSelected] = useState<Selected>(EMPTY_SELECTION);
  const [dragged, setDragged] = useState<{ slot: AdminHomePlacementSlot; index: number } | null>(null);
  const syncedData = useRef(query.data);

  useEffect(() => {
    if (!query.data || query.data === syncedData.current) return;
    syncedData.current = query.data;
    const next = { ...EMPTY_SELECTION };
    query.data.placements.forEach((placement) => {
      next[placement.slot] = placement.productIds;
    });
    setSelected(next);
  }, [query.data]);

  const publishedProducts = useMemo(() => query.data?.products.filter((product) => product.status === 'PUBLISHED') ?? [], [query.data?.products]);
  const productMap = useMemo(() => new Map((query.data?.products ?? []).map((product) => [product.id, product])), [query.data?.products]);

  const toggle = (slot: AdminHomePlacementSlot, id: string) => {
    setSelected((current) => {
      const ids = current[slot];
      if (ids.includes(id)) return { ...current, [slot]: ids.filter((value) => value !== id) };
      if (ids.length >= SLOT_META[slot].limit) return current;
      return { ...current, [slot]: [...ids, id] };
    });
  };

  const selectHero = (value: string) => {
    setSelected((current) => ({ ...current, HERO_PRODUCT: value ? [value] : [] }));
  };

  const startDrag = (slot: AdminHomePlacementSlot, index: number) => setDragged({ slot, index });
  const endDrag = () => setDragged(null);
  const drop = (slot: AdminHomePlacementSlot, to: number) => {
    if (!dragged || dragged.slot !== slot || dragged.index === to) {
      setDragged(null);
      return;
    }
    setSelected((current) => {
      const ids = [...current[slot]];
      const [item] = ids.splice(dragged.index, 1);
      if (!item) return current;
      ids.splice(to, 0, item);
      return { ...current, [slot]: ids };
    });
    setDragged(null);
  };

  const save = (slot: AdminHomePlacementSlot) => updatePlacement.mutate({ slot, productIds: selected[slot] });

  return { ...query, updatePlacement, selected, dragged, publishedProducts, productMap, toggle, selectHero, startDrag, endDrag, drop, save };
}
