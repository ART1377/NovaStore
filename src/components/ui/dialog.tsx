// src/components/ui/dialog.tsx
'use client';
import { X } from 'lucide-react';
import { Button } from './button';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'حذف',
  cancelLabel = 'انصراف',
  busy = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        className="border-nova-line bg-nova-surface w-full max-w-md rounded-3xl border p-6 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black">{title}</h2>
            <p className="text-nova-primary mt-2 text-sm leading-7">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-nova-muted hover:bg-nova-soft rounded-full p-2"
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'در حال انجام...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
