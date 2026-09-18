// src/components/shared/stat.tsx
import { formatNumber } from '@/lib/utils';
export function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-nova-surface rounded-xl border px-3 py-2 text-center">
      <div className="text-nova-muted">{title}</div>
      <b className="mt-1 block text-base">{formatNumber(value)}</b>
    </div>
  );
}
