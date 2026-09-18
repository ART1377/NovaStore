// src/features/catalog/components/filter-button.tsx
import type { ReactNode } from 'react';

type Props = {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
};

export function FilterButton({ active, children, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2.5 text-right text-sm transition ${active ? 'bg-nova-ink text-white' : 'hover:bg-nova-hover'}`}
    >
      {children}
    </button>
  );
}
