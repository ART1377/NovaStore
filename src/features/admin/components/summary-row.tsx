// src/features/admin/components/summary-row.tsx
export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
      <span className="text-nova-primary">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
