// src/features/account/components/quick-account-card.tsx
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

export function QuickAccountCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group border-nova-line bg-nova-surface hover:bg-nova-hover rounded-3xl border p-5 transition hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3">
        <span className="bg-nova-hover text-nova-primary grid size-10 place-items-center rounded-2xl">
          <Icon size={19} />
        </span>
        <div className="min-w-0">
          <p className="font-bold">{title}</p>
          <p className="text-nova-muted mt-1 text-xs">{description}</p>
        </div>
        <ArrowLeft
          size={15}
          className="text-nova-muted mr-auto transition group-hover:-translate-x-0.5"
        />
      </div>
    </Link>
  );
}
