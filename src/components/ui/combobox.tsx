'use client';

import { Check, ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useCloseOnOutsideInteraction } from '@/hooks/use-close-on-outside-interaction';

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ComboboxRenderProps = {
  option: ComboboxOption;
  selected: boolean;
};

type ComboboxProps = {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  clearable?: boolean;
  className?: string;
  renderOption?: (props: ComboboxRenderProps) => React.ReactNode;
  renderSelected?: (option: ComboboxOption) => React.ReactNode;
};

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'انتخاب کنید',
  searchPlaceholder = 'جستجو بین گزینه‌ها...',
  emptyText = 'گزینه‌ای پیدا نشد.',
  clearable = false,
  className,
  renderOption,
  renderSelected,
}: ComboboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return options;
    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(normalized),
    );
  }, [options, query]);

  useCloseOnOutsideInteraction(ref, open, () => {
    setOpen(false);
    setQuery('');
  });

  useEffect(() => {
    if (open) window.setTimeout(() => searchRef.current?.focus(), 0);
  }, [open]);

  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className={cn('relative w-full', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="border-nova-line bg-nova-surface text-nova-ink hover:border-nova-primary focus-visible:ring-nova-accent/30 flex h-full min-h-11 w-full items-center justify-between gap-3 rounded-xl border px-3 text-sm transition outline-none focus-visible:ring-2"
      >
        {selected ? (
          renderSelected?.(selected) ?? (
            <span className="min-w-0 flex-1 truncate text-right">
              {selected.label}
            </span>
          )
        ) : (
          <span className="min-w-0 flex-1 truncate text-right text-nova-muted">
            {placeholder}
          </span>
        )}
        <span className="flex shrink-0 items-center gap-1">
          {clearable && value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onChange('');
              }}
              className="text-nova-muted hover:bg-nova-soft rounded-full p-1"
              aria-label="پاک کردن انتخاب"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={cn(
              'text-nova-muted transition-transform',
              open && 'rotate-180',
            )}
          />
        </span>
      </button>

      {open && (
        <div className="border-nova-line bg-nova-surface absolute inset-x-0 top-[calc(100%+7px)] z-[70] overflow-hidden rounded-2xl border shadow-2xl">
          <div className="border-b p-2">
            <div className="bg-nova-soft/60 relative rounded-xl">
              <Search
                size={15}
                className="text-nova-muted absolute top-1/2 right-3 -translate-y-1/2"
              />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 w-full bg-transparent pr-9 pl-3 text-sm outline-none"
              />
            </div>
          </div>
          <div role="listbox" className="max-h-64 overflow-auto p-1.5">
            {filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                disabled={option.disabled}
                onClick={() => choose(option)}
                className={cn(
                  'flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-right text-sm transition',
                  option.disabled
                    ? 'text-nova-muted cursor-not-allowed opacity-60'
                    : 'text-nova-ink hover:bg-nova-hover cursor-pointer',
                )}
              >
                {renderOption ? (
                  <span className="min-w-0 flex-1">
                    {renderOption({
                      option,
                      selected: option.value === value,
                    })}
                  </span>
                ) : (
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                )}
                {option.value === value && (
                  <Check size={15} className="text-nova-accent shrink-0" />
                )}
              </button>
            ))}
            {!filtered.length && (
              <p className="text-nova-muted px-3 py-7 text-center text-xs">
                {emptyText}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
