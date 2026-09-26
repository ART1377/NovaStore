// src/components/ui/checkbox.tsx
'use client';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
export function Checkbox({
  className,
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-3 select-none',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        {...props}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="border-nova-line-strong bg-nova-surface peer-focus-visible:ring-nova-accent/30 peer-checked:border-nova-accent peer-checked:bg-nova-accent grid size-5 shrink-0 place-items-center rounded-md border text-white shadow-sm transition peer-focus-visible:ring-2"
      >
        {checked && <Check size={14} strokeWidth={3} />}
      </span>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
