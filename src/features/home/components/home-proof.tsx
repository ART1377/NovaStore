// src/features/home/components/home-proof.tsx
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

export function HomeProof({ text, icon }: { text: string; icon?: ReactNode }) {
  return (
    <div className="border-nova-line bg-nova-surface/75 flex items-center gap-2 rounded-2xl border px-3 py-2.5">
      <span className="bg-nova-hover text-nova-primary grid size-6 shrink-0 place-items-center rounded-full">
        {icon ?? <Check size={12} />}
      </span>
      {text}
    </div>
  );
}
