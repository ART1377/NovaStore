// src/components/ui/password-input.tsx
'use client';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement>;
export function PasswordInput({ className, ...props }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative w-full">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn(
          'border-nova-line-strong bg-nova-surface focus:border-nova-primary focus:ring-nova-primary/15 h-10 w-full rounded-xl border px-3 pl-11 transition outline-none focus:ring-2',
          className,
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="text-nova-muted hover:bg-nova-soft hover:text-nova-ink absolute top-1/2 left-2 -translate-y-1/2 rounded-full p-1.5 transition"
        aria-label={visible ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
