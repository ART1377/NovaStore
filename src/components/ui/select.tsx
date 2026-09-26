// src/components/ui/select.tsx
'use client';
import { useCloseOnOutsideInteraction } from '@/hooks/use-close-on-outside-interaction';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import { Children, useMemo, useRef, useState } from 'react';
type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'onChange'
> & {
  onChange?: (event: {
    target: { value: string };
    currentTarget: { value: string };
  }) => void;
};
export function Select({
  className,
  value,
  defaultValue,
  onChange,
  disabled,
  children,
  ...props
}: SelectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const options = useMemo(() => {
    const nodes = Children.toArray(children);
    return nodes.flatMap((child) => {
      if (!child || typeof child !== 'object' || !('props' in child)) return [];
      const el = child as React.ReactElement<{
        value?: string;
        children?: React.ReactNode;
      }>;
      return [
        {
          value: String(el.props.value ?? ''),
          label: String(el.props.children ?? ''),
        },
      ];
    });
  }, [children]);
  const current = String(value ?? defaultValue ?? '');
  const selected = options.find((o) => o.value === current) ?? options[0];
  useCloseOnOutsideInteraction(ref, open, () => setOpen(false));
  const choose = (next: string) => {
    onChange?.({ target: { value: next }, currentTarget: { value: next } });
    setOpen(false);
  };
  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'border-nova-line bg-nova-surface text-nova-ink hover:border-nova-primary focus-visible:ring-nova-accent/30 flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-3 text-sm transition outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        <span className="truncate">{selected?.label ?? ''}</span>
        <ChevronDown
          size={16}
          className={cn(
            'text-nova-muted shrink-0 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div
          role="listbox"
          className="border-nova-line bg-nova-surface absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-auto rounded-2xl border p-1.5 shadow-xl"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === current}
              onClick={() => choose(option.value)}
              className="text-nova-ink hover:bg-nova-hover flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right text-sm transition"
            >
              <span>{option.label}</span>
              {option.value === current && (
                <Check size={15} className="text-nova-accent" />
              )}
            </button>
          ))}
        </div>
      )}
      <select
        aria-hidden="true"
        tabIndex={-1}
        value={current}
        onChange={() => {}}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        {...props}
      />
    </div>
  );
}
