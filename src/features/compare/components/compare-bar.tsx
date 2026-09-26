// src/features/compare/components/compare-bar.tsx
'use client';

import { ArrowLeft, GitCompareArrows, X } from 'lucide-react';
import Link from 'next/link';
import { useCompare } from '../hooks/use-compare';

export function CompareBar() {
  const { items, remove, clear } = useCompare();
  if (!items.length) return null;
  return (
    <div className="bg-nova-ink fixed bottom-4 left-1/2 z-50 w-[min(94vw,560px)] -translate-x-1/2 rounded-2xl border p-3 text-white shadow-2xl">
      <div className="flex items-center gap-3">
        <span className="bg-nova-surface/10 rounded-xl p-2">
          <GitCompareArrows size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">مقایسه محصولات</p>
          <p className="text-nova-muted text-xs">
            {items.length} محصول انتخاب شده · حداکثر ۴ محصول
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="hover:bg-nova-surface/10 rounded-lg p-2"
          aria-label="پاک کردن"
        >
          <X size={16} />
        </button>
        <Link
          href="/compare"
          className="bg-nova-surface text-nova-ink inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold"
        >
          مقایسه <ArrowLeft size={14} />
        </Link>
      </div>
      <div className="mt-2 flex gap-1">
        {items.map((id) => (
          <button
            type="button"
            key={id}
            onClick={() => remove(id)}
            className="bg-nova-surface/10 rounded-lg px-2 py-1 text-[10px] text-[#cbd5e1]"
            title={id}
          >
            {id.slice(0, 6)}…
          </button>
        ))}
      </div>
    </div>
  );
}
