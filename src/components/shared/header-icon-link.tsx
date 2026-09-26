// src/components/shared/header-icon-link.tsx
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
export function HeaderIconLink({
  href,
  label,
  icon: Icon,
  badge,
  className,
  active = false,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  className?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={cn(
        'text-nova-ink hover:border-nova-line hover:bg-nova-hover relative inline-flex rounded-2xl border border-transparent p-2.5 transition',
        active && 'bg-nova-hover',
        className,
      )}
    >
      <Icon size={18} />
      {badge && badge > 0 ? (
        <span className="bg-nova-primary ring-nova-surface absolute -top-1 -right-1 min-w-5 rounded-full px-1 text-center text-[9px] font-bold text-white ring-2">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
