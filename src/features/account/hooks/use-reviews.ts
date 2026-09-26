// src/features/account/hooks/use-reviews.ts
'use client';

import { QUERY_KEYS } from '@/lib/query-keys';
import { useQuery } from '@tanstack/react-query';
import { accountReviewsService } from '../api/reviews.api';

export function useAccountReviews() {
  return useQuery({
    queryKey: QUERY_KEYS.accountReviews,
    queryFn: accountReviewsService.get,
    staleTime: 60_000,
    retry: 1,
  });
}
