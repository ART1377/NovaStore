// src/features/account/components/profile-stats.tsx
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

type ProfileStat = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};

type ProfileStatsProps = {
  stats: ProfileStat[];
};

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-3">
            <span className="bg-nova-hover text-nova-primary grid size-11 place-items-center rounded-2xl">
              <Icon size={20} />
            </span>
            <div>
              <p className="text-nova-muted text-xs">{label}</p>
              <p className="mt-1 text-xl font-black">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
