// src/components/ui/numeric-input.tsx
'use client';

import { useRef } from 'react';
import { Input, type InputProps } from './input';
import { formatInputNumber, numericInputValue } from '@/lib/utils';

type NumericInputProps = Omit<InputProps, 'value' | 'onChange'> & {
  value: string;
  onValueChange: (value: string) => void;
};

export function NumericInput({
  value,
  onValueChange,
  ...props
}: NumericInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const cursor = event.target.selectionStart ?? rawValue.length;
    const digitsBeforeCursor = numericInputValue(
      rawValue.slice(0, cursor),
    ).replace(/\D/g, '').length;
    const nextValue = formatInputNumber(rawValue);

    onValueChange(nextValue);

    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      if (!digitsBeforeCursor) {
        input.setSelectionRange(0, 0);
        return;
      }
      let digitsSeen = 0;
      let nextCursor = nextValue.length;
      for (let index = 0; index < nextValue.length; index += 1) {
        if (/\d/.test(nextValue[index])) digitsSeen += 1;
        if (digitsSeen === digitsBeforeCursor) {
          nextCursor = index + 1;
          break;
        }
      }
      input.setSelectionRange(nextCursor, nextCursor);
    });
  };

  return (
    <Input
      {...props}
      ref={inputRef}
      value={value}
      inputMode="numeric"
      onChange={handleChange}
    />
  );
}
