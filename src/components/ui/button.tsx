// src/components/ui/button.tsx
import { cn } from '@/lib/utils';

const variants = {
  default:
    'bg-nova-primary text-white shadow-[0_14px_30px_-15px_rgba(73,88,103,.65)] hover:bg-nova-ink hover:-translate-y-0.5',
  outline:
    'border border-nova-line-strong bg-nova-surface text-nova-ink hover:border-nova-primary hover:bg-nova-hover',
  ghost: 'text-nova-ink hover:bg-nova-hover',
  danger:
    'border border-nova-danger-border bg-nova-danger-soft text-nova-danger hover:bg-nova-danger-border/20',
} as const;

const sizes = {
  sm: 'h-9 px-3 text-xs',
  default: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
  icon: 'h-10 w-10 p-0',
} as const;

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl font-semibold tracking-[-.01em] whitespace-nowrap transition duration-200 active:scale-[.985] disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
