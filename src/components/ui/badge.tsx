// src/components/ui/badge.tsx
import { cn } from '@/lib/utils';
export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'bg-nova-soft text-nova-ink inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        className,
      )}
      {...props}
    />
  );
}
