// src/app/account/orders/[id]/page.tsx
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { getAccountOrder } from '@/features/orders/api/orders-server.api';
import { OrderTrackingPage } from '@/features/orders/components/order-tracking-page';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAuthSession();
  if (!session) redirect('/login');
  const { id } = await params;
  const order = await getAccountOrder(id, session.user.id);

  if (!order) redirect('/account/orders');
  return <OrderTrackingPage order={order} />;
}
