// src/features/catalog/components/filter-check-row.tsx
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

export function FilterCheckRow({ checked, onChange, label }: Props) {
  return (
    <Checkbox
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      label={label}
      className="hover:bg-nova-hover w-full rounded-xl p-2.5 text-right"
    />
  );
}
