// src/features/catalog/components/gallery-arrow.tsx
'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  direction: 'next' | 'previous';
  onClick: () => void;
};

export function GalleryArrow({ direction, onClick }: Props) {
  const previous = direction === 'previous';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/70 p-2.5 text-zinc-700 shadow-sm transition hover:bg-white',
        previous ? 'right-3' : 'left-3',
      )}
      aria-label={previous ? 'تصویر قبلی' : 'تصویر بعدی'}
    >
      {previous ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
    </button>
  );
}
