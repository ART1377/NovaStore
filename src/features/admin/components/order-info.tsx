// src/features/admin/components/order-info.tsx
type Props = {
  label: string;
  value: string;
};

export function OrderInfo({ label, value }: Props) {
  return (
    <div>
      <p className="text-nova-muted text-xs">{label}</p>
      <p className="mt-1 font-medium break-words">{value}</p>
    </div>
  );
}
