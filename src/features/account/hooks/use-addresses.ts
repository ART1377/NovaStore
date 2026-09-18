// src/features/account/hooks/use-addresses.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/query-keys';
import { addressesService } from '../api/addresses.api';

export function useAddresses() {
  return useQuery({
    queryKey: QUERY_KEYS.addresses,
    queryFn: addressesService.get,
    staleTime: 60_000,
    retry: 1,
  });
}
