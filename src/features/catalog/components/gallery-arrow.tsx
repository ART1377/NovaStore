// src/features/catalog/components/gallery-arrow.tsx
'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  direction: 'next' | 'previous';
  onClick: () => void;
  lightbox?: boolean;
};

export function GalleryArrow({ direction, onClick, lightbox = false }: Props) {
  const previous = direction === 'previous';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-10 -translate-y-1/2 rounded-full p-2.5 shadow-sm transition',
        previous ? 'right-3' : 'left-3',
        lightbox
          ? 'bg-white/10 text-white backdrop-blur hover:bg-white/20'
          : 'bg-white/90 text-zinc-700 hover:bg-white',
      )}
      aria-label={previous ? 'تصویر قبلی' : 'تصویر بعدی'}
    >
      {previous ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
    </button>
  );
}
