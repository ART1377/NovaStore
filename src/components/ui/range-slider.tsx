// src/components/ui/range-slider.tsx
'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type RangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onChange: (values: [number, number]) => void;
  className?: string;
  onMouseUp?: () => void;
  onTouchEnd?: () => void;
  'aria-label'?: string;
};

export function RangeSlider({
  min,
  max,
  step = 1,
  minValue,
  maxValue,
  onChange,
  className,
  onMouseUp,
  onTouchEnd,
  'aria-label': ariaLabel = 'بازه قیمت',
}: RangeSliderProps) {
  const safeMin = Math.min(min, max);
  const safeMax = Math.max(min, max);
  const safeMinValue = Math.max(safeMin, Math.min(minValue, safeMax));
  const safeMaxValue = Math.max(safeMinValue, Math.min(maxValue, safeMax));
  const span = Math.max(1, safeMax - safeMin);

  // RTL: the physical left thumb is the maximum value, and the right thumb is the minimum value.
  const left = 100 - ((safeMaxValue - safeMin) / span) * 100;
  const right = ((safeMinValue - safeMin) / span) * 100;
  const rangeStyle = useMemo(
    () => ({ left: `${left}%`, right: `${right}%` }),
    [left, right],
  );

  const updateMin = (value: number) =>
    onChange([Math.min(value, safeMaxValue), safeMaxValue]);
  const updateMax = (value: number) =>
    onChange([safeMinValue, Math.max(value, safeMinValue)]);

  return (
    <div
      className={cn('relative h-7 w-full', className)}
      dir="rtl"
      aria-label={ariaLabel}
    >
      <div className="bg-nova-soft pointer-events-none absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full" />
      <div
        className="bg-nova-primary pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
        style={rangeStyle}
      />
      <input
        type="range"
        min={safeMin}
        max={safeMax}
        step={step}
        value={safeMaxValue}
        onChange={(event) => updateMax(Number(event.target.value))}
        className="range-input absolute inset-0 z-20 h-7 w-full appearance-none bg-transparent"
        aria-label="حداکثر قیمت"
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      />
      <input
        type="range"
        min={safeMin}
        max={safeMax}
        step={step}
        value={safeMinValue}
        onChange={(event) => updateMin(Number(event.target.value))}
        className="range-input absolute inset-0 z-10 h-7 w-full appearance-none bg-transparent"
        aria-label="حداقل قیمت"
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      />
    </div>
  );
}
