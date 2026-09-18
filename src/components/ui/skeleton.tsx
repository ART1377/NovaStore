// src/components/ui/skeleton.tsx
import { cn } from '@/lib/utils';
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-nova-line animate-pulse rounded-xl', className)} />
  );
}
