// src/features/catalog/hooks/use-search-suggestions-state.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import { SUGGESTION_DEBOUNCE_MS, SUGGESTION_MIN_LENGTH } from '@/constants/constants';
import { useSearchSuggestions } from './use-search-suggestions';

export function useSearchSuggestionsState(value: string) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputValue = value.trim();

  useEffect(() => {
    const timer = window.setTimeout(() => setTerm(inputValue), SUGGESTION_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const enabled = term.length >= SUGGESTION_MIN_LENGTH;
  const query = useSearchSuggestions(term);

  return { ref, open, setOpen, enabled, data: query.data ?? [], isFetching: query.isFetching };
}
