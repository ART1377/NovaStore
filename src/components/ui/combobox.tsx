// src/components/ui/combobox.tsx
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
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
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
    setActiveIndex(-1);
  });

  useEffect(() => {
    if (open) {
      setActiveIndex(filtered.findIndex((option) => !option.disabled));
      window.setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open, filtered]);

  // Keep the active option visible while arrowing through a long list.
  useEffect(() => {
    if (activeIndex < 0) return;
    const container = listRef.current;
    if (!container) return;
    const node = container.children[activeIndex] as HTMLElement | undefined;
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
  };

  const moveActive = (direction: 1 | -1) => {
    if (!filtered.length) return;
    let next = activeIndex;
    for (let step = 0; step < filtered.length; step += 1) {
      next = (next + direction + filtered.length) % filtered.length;
      if (!filtered[next]?.disabled) {
        setActiveIndex(next);
        return;
      }
    }
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) choose(option);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      setQuery('');
    }
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
          (renderSelected?.(selected) ?? (
            <span className="min-w-0 flex-1 truncate text-right">
              {selected.label}
            </span>
          ))
        ) : (
          <span className="text-nova-muted min-w-0 flex-1 truncate text-right">
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
                setOpen(false);
                setQuery('');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  onChange('');
                  setOpen(false);
                  setQuery('');
                }
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
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={onSearchKeyDown}
                placeholder={searchPlaceholder}
                className="h-10 w-full bg-transparent pr-9 pl-3 text-sm outline-none"
                aria-controls="combobox-listbox"
                aria-activedescendant={
                  activeIndex >= 0
                    ? `combobox-option-${activeIndex}`
                    : undefined
                }
              />
            </div>
          </div>
          <div
            ref={listRef}
            id="combobox-listbox"
            role="listbox"
            className="max-h-64 overflow-auto p-1.5"
          >
            {filtered.map((option, index) => (
              <button
                key={option.value}
                id={`combobox-option-${index}`}
                type="button"
                role="option"
                aria-selected={option.value === value}
                disabled={option.disabled}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
                className={cn(
                  'flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-right text-sm transition',
                  option.disabled
                    ? 'text-nova-muted cursor-not-allowed opacity-60'
                    : 'text-nova-ink hover:bg-nova-hover cursor-pointer',
                  index === activeIndex && !option.disabled && 'bg-nova-hover',
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
                  <span className="min-w-0 flex-1 truncate">
                    {option.label}
                  </span>
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
