// src/features/catalog/components/filter-section.tsx
import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export function FilterSection({ title, children }: Props) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      {children}
    </section>
  );
}
