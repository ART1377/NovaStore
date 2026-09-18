// src/components/shared/empty-state.tsx
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}) {
  return (
    <div
      className={`border-nova-line bg-nova-surface rounded-3xl border px-6 py-20 text-center ${className}`}
    >
      {Icon ? (
        <Icon size={44} strokeWidth={1.7} className="text-nova-muted mx-auto" />
      ) : null}
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      {description ? (
        <p className="text-nova-primary mx-auto mt-2 max-w-xl text-sm leading-7">
          {description}
        </p>
      ) : null}
      {action ? (
        action.href ? (
          <Link href={action.href}>
            <Button className="mt-5">{action.label}</Button>
          </Link>
        ) : (
          <Button className="mt-5" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      ) : null}
    </div>
  );
}
