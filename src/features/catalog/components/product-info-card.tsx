// src/features/catalog/components/product-info-card.tsx
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
  icon: ReactNode;
  title: string;
  text: string;
};

export function ProductInfoCard({ icon, title, text }: Props) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="bg-nova-soft rounded-xl p-2.5">{icon}</span>
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="text-nova-primary mt-1 text-[11px]">{text}</p>
        </div>
      </CardContent>
    </Card>
  );
}
