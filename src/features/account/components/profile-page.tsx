// src/features/account/components/profile-page.tsx
'use client';

import { SignOutButton } from '@/components/shared/sign-out-button';
import { Button } from '@/components/ui/button';
import { useAccountReviews } from '@/features/account/hooks/use-reviews';
import { useOrders } from '@/features/orders/hooks/use-orders';
import { Heart, KeyRound, Package, ShieldCheck, UserRound } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { AddressManager } from './address-manager';
import { ProfileOrdersPreview } from './profile-orders-preview';
import { ProfileReviewsCard } from './profile-reviews-card';
import { ProfileSettings } from './profile-settings';
import { ProfileStats } from './profile-stats';

export function ProfilePage() {
  const { data: session } = useSession();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: reviews = [], isLoading: reviewsLoading } = useAccountReviews();

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === 'DELIVERED',
  ).length;
  const activeOrders = orders.filter(
    (order) => !['DELIVERED', 'CANCELLED'].includes(order.orderStatus),
  ).length;

  const stats = [
    { label: 'کل سفارش‌ها', value: orders.length, icon: Package },
    { label: 'تحویل‌شده', value: deliveredOrders, icon: ShieldCheck },
    { label: 'سفارش‌های فعال', value: activeOrders, icon: KeyRound },
    {
      label: 'نوع حساب',
      value: session?.user.role === 'ADMIN' ? 'مدیر' : 'مشتری',
      icon: UserRound,
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-nova-muted text-xs">نووا / حساب کاربری / پروفایل</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">پروفایل من</h1>
          <p className="text-nova-primary mt-2 text-sm leading-7">
            اطلاعات حساب، امنیت و وضعیت سفارش‌ها را از یکجا مدیریت کن.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/account/orders">
            <Button variant="outline">
              <Package size={16} /> سفارش‌ها
            </Button>
          </Link>
          <Link href="/account/wishlist">
            <Button variant="outline">
              <Heart size={16} /> علاقه‌مندی‌ها
            </Button>
          </Link>
          <SignOutButton />
        </div>
      </div>

      <ProfileStats stats={stats} />
      <ProfileSettings />
      <section className="mt-8">
        <AddressManager />
      </section>
      <ProfileReviewsCard reviews={reviews} isLoading={reviewsLoading} />
      <ProfileOrdersPreview orders={orders} isLoading={ordersLoading} />
    </main>
  );
}
