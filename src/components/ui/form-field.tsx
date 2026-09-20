// src/components/ui/form-field.tsx
import { cn } from '@/lib/utils';

export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid min-w-0 gap-2', className)}>
      <label className="text-sm font-semibold">
        {label}
        {required ? (
          <span className="text-nova-danger mr-1" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      <div className="min-h-5">
        {error ? (
          <p
            role="alert"
            className="text-nova-danger flex items-start gap-1.5 text-xs leading-5 font-medium"
          >
            <span aria-hidden="true">•</span>
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p className="text-nova-muted text-xs leading-5">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
