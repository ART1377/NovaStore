import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductImagePlaceholder({
  label = 'تصویر محصول موجود نیست',
  compact = false,
  className,
}: {
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'from-nova-soft via-nova-surface to-nova-hover flex h-full w-full flex-col items-center justify-center bg-gradient-to-br text-center',
        className,
      )}
    >
      <div
        className={cn(
          'grid place-items-center rounded-2xl border border-nova-line bg-nova-surface/80 shadow-sm',
          compact ? 'size-11' : 'size-16',
        )}
      >
        <ImageOff
          className="text-nova-muted"
          size={compact ? 19 : 25}
          strokeWidth={1.7}
        />
      </div>
      <span
        className={cn(
          'text-nova-muted mt-3 px-4 font-semibold',
          compact ? 'text-[10px]' : 'text-xs',
        )}
      >
        {label}
      </span>
    </div>
  );
}
