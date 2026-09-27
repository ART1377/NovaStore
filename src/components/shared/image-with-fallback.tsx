// src/components/shared/image-with-fallback.tsx
'use client';

import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type Props = Omit<ImageProps, 'onError'> & {
  fallback?: React.ReactNode;
  fallbackClassName?: string;
};

export function ImageWithFallback({
  fallback,
  fallbackClassName,
  className,
  alt,
  ...props
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          'bg-nova-hover text-nova-muted flex h-full w-full flex-col items-center justify-center gap-1',
          fallbackClassName,
        )}
        role="img"
        aria-label={typeof alt === 'string' ? alt : undefined}
      >
        {fallback ?? (
          <>
            <ImageOff size={20} strokeWidth={1.7} />
            <span className="text-[10px] font-medium">تصویر موجود نیست</span>
          </>
        )}
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
