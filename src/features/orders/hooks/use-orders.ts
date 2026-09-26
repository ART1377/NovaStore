// src/features/orders/hooks/use-orders.ts
'use client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '../api/orders.api';

export function useOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: ordersService.get,
    staleTime: 30_000,
  });
}
export function useOrder(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.order(id),
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
  });
}
