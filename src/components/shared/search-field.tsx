// src/components/shared/search-field.tsx
'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
export function SearchField({
  value,
  onChange,
  placeholder = 'جستجو...',
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full min-w-0 flex-1 ${className ?? ''}`}>
      <Search className="text-nova-muted pointer-events-none absolute top-1/2 right-3 z-10 h-5 w-5 -translate-y-1/2" />
      <Input
        className="h-12 min-w-0 pr-10 text-sm sm:text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        clearable
        onClear={() => onChange('')}
        placeholder={placeholder}
      />
    </div>
  );
}
