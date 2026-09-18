// src/app/admin/orders/[id]/page.tsx
import { AdminOrderDetail } from '@/features/admin/components/order-detail';
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AdminOrderDetail id={(await params).id} />;
}
