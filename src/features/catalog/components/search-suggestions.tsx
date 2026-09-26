// src/features/catalog/components/search-suggestions.tsx
'use client';

import Link from 'next/link';
import { useSearchSuggestionsState } from '../hooks/use-search-suggestions-state';

export function SearchSuggestions({ value }: { value: string }) {
  const { ref, open, setOpen, enabled, data, isFetching } =
    useSearchSuggestionsState(value);
  if (!open || !enabled) return null;

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label="پیشنهادهای جستجو"
      className="bg-nova-surface absolute top-full right-0 z-30 mt-2 w-full overflow-hidden rounded-2xl border shadow-xl"
      onMouseEnter={() => setOpen(true)}
    >
      {isFetching && !data.length ? (
        <div className="text-nova-muted px-4 py-4 text-sm">در حال جستجو...</div>
      ) : data.length ? (
        data.map((item) => (
          <Link
            key={item.id}
            role="option"
            href={`/products/${item.slug}`}
            onClick={() => setOpen(false)}
            onMouseDown={() => setOpen(false)}
            className="hover:bg-nova-hover block border-b px-4 py-3 text-sm last:border-0"
          >
            {item.name}
          </Link>
        ))
      ) : (
        <div className="text-nova-muted px-4 py-4 text-sm">موردی پیدا نشد.</div>
      )}
    </div>
  );
}
