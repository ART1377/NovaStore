// src/features/admin/components/dashboard-metric.tsx
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  icon: ReactNode;
  title: string;
  value: string;
};

export function DashboardMetric({ icon, title, value }: Props) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="text-nova-primary flex items-center gap-2">
          <span className="bg-nova-soft rounded-lg p-2">{icon}</span>
          <span className="text-xs sm:text-sm">{title}</span>
        </div>
        <p className="mt-3 text-lg font-black break-words sm:text-2xl">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
