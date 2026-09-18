// src/features/home/components/home-trust-item.tsx
import type { ReactNode } from 'react';

export function HomeTrustItem({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="border-nova-line bg-nova-surface flex min-w-0 items-center gap-3 rounded-[22px] border p-4 shadow-[0_12px_35px_-30px_rgba(17,24,39,.3)]">
      <span className="bg-nova-hover text-nova-primary grid size-10 shrink-0 place-items-center rounded-2xl">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-6 text-[#6f879d]">{text}</p>
      </div>
    </div>
  );
}
