// src/features/home/components/home-section-header.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function HomeSectionHeader({
  label,
  title,
  href,
}: {
  label: string;
  title: string;
  href: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        <p className="text-nova-primary text-xs font-bold">{label}</p>
        <h2 className="mt-1 text-xl font-black tracking-[-.025em] sm:text-2xl">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="text-nova-primary hover:text-nova-primary flex shrink-0 items-center gap-1 text-xs font-bold transition sm:text-sm"
      >
        مشاهده همه <ArrowLeft size={14} />
      </Link>
    </div>
  );
}
