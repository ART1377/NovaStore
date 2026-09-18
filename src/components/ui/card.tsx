// src/components/ui/card.tsx
import { cn } from '@/lib/utils';
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border-nova-soft bg-nova-surface rounded-[24px] border shadow-[0_14px_38px_-28px_rgba(73,88,103,.36)]',
        className,
      )}
      {...props}
    />
  );
}
export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4 sm:p-5', className)} {...props} />;
}
