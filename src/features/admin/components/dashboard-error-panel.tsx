// src/features/admin/components/dashboard-error-panel.tsx
import { Clock3 } from 'lucide-react';

export function DashboardErrorPanel() {
  return (
    <div className="bg-nova-surface rounded-2xl border p-10 text-center">
      <Clock3 className="text-nova-muted mx-auto" />
      <p className="mt-3 font-semibold">دریافت اطلاعات داشبورد ناموفق بود.</p>
      <p className="text-nova-primary mt-1 text-sm">
        صفحه را دوباره بارگذاری کنید.
      </p>
    </div>
  );
}
