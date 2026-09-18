// src/components/ui/input.tsx
import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  clearable?: boolean;
  onClear?: () => void;
};
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, clearable = false, onClear, value, ...props }: InputProps,
  ref,
) {
  const hasValue = value !== undefined && String(value).length > 0;
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        value={value}
        className={cn(
          'border-nova-line-strong bg-nova-surface focus:border-nova-primary focus:ring-nova-primary/15 aria-[invalid=true]:border-nova-danger aria-[invalid=true]:focus:ring-nova-danger/10 h-10 w-full rounded-xl border px-3 transition outline-none focus:ring-2',
          clearable && hasValue && 'pl-10',
          className,
        )}
        {...props}
      />
      {clearable && hasValue && (
        <button
          type="button"
          onClick={onClear}
          className="text-nova-muted hover:bg-nova-soft hover:text-nova-ink absolute top-1/2 left-2 -translate-y-1/2 rounded-full p-1.5"
          aria-label="پاک کردن"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
});

Input.displayName = 'Input';
