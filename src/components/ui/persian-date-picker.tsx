// src/components/ui/persian-date-picker.tsx
'use client';

import { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { DayPicker, faIR } from '@daypicker/persian';
import { cn, formatDate } from '@/lib/utils';
import { Button } from './button';

export function PersianDatePicker({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  disabled,
}: {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const label = useMemo(
    () => (value ? formatDate(value) : placeholder),
    [placeholder, value],
  );

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'h-11 w-full justify-between font-normal',
          !value && 'text-nova-muted',
        )}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          <CalendarDays size={16} />
          {label}
        </span>
      </Button>

      {open && (
        <>
          <button
            type="button"
            aria-label="بستن تقویم"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="border-nova-line bg-nova-surface absolute right-0 z-50 mt-2 overflow-auto rounded-2xl border p-3 shadow-xl">
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
              locale={faIR}
              dir="rtl"
              numerals="arabext"
            />
          </div>
        </>
      )}
    </div>
  );
}
