// src/features/admin/components/dashboard-empty-chart.tsx
import { BarChart3 } from 'lucide-react';

export function DashboardEmptyChart() {
  return (
    <div className="text-nova-muted flex h-full w-full flex-col items-center justify-center gap-2 text-sm">
      <BarChart3 size={26} strokeWidth={1.6} />
      <span>هنوز فروشی ثبت نشده تا روند آن نمایش داده شود.</span>
    </div>
  );
}
