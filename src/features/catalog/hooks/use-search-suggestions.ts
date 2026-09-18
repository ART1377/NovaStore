// src/features/catalog/hooks/use-search-suggestions.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { searchService } from '../api/search.api';
import { QUERY_KEYS } from '@/lib/query-keys';
import {
  SUGGESTION_GC_TIME_MS,
  SUGGESTION_MIN_LENGTH,
  SUGGESTION_STALE_TIME_MS,
} from '@/constants/constants';

export function useSearchSuggestions(term: string) {
  const enabled = term.length >= SUGGESTION_MIN_LENGTH;
  return useQuery({
    queryKey: QUERY_KEYS.searchSuggestions(term),
    queryFn: () => searchService.suggestions(term),
    enabled,
    staleTime: SUGGESTION_STALE_TIME_MS,
    gcTime: SUGGESTION_GC_TIME_MS,
    retry: false,
  });
}
