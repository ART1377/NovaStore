// src/features/admin/components/admin-page-header.tsx
import type { ReactNode } from 'react';

export function AdminPageHeader({
  eyebrow = 'مدیریت',
  title,
  description,
  action,
  controls,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  controls?: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-nova-primary text-xs">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h1>
          {description ? (
            <p className="text-nova-primary mt-1 text-sm">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {controls ? (
        <div className="bg-nova-surface mt-6 rounded-2xl border p-3">
          {controls}
        </div>
      ) : null}
    </>
  );
}

export function AdminFilterGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
      {children}
    </div>
  );
}
