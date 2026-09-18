// src/features/admin/components/admin-form-field.tsx
import type { ReactNode } from 'react';

export function AdminFormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-2 text-sm font-semibold">
      <label>{label}</label>
      {children}
      <p className="text-nova-danger min-h-5 text-xs leading-5 font-medium">
        {error ?? ''}
      </p>
    </div>
  );
}
