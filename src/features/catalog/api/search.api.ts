// src/features/catalog/api/search.api.ts
import api from '@/lib/api-client';

export type SearchSuggestion = {
  id: string;
  name: string;
  slug: string;
};

export const searchService = {
  suggestions: async (term: string): Promise<SearchSuggestion[]> =>
    (
      await api.get<SearchSuggestion[]>('/products/suggestions', {
        params: { q: term },
      })
    ).data,
};
