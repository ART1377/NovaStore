// src/features/admin/components/admin-dashboard.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ORDER_STATUS_LABELS } from '@/constants/constants';
import { formatNumber, formatPrice } from '@/lib/utils';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Boxes,
  CircleDollarSign,
  PackageSearch,
  ShoppingCart,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useAdminStats } from '../hooks/use-admin';
import { DashboardEmptyChart } from './dashboard-empty-chart';
import { DashboardErrorPanel } from './dashboard-error-panel';
import { DashboardMetric } from './dashboard-metric';
import { DashboardSkeleton } from './dashboard-skeleton';

export function AdminDashboard() {
  const { data, isLoading, error } = useAdminStats();
  if (isLoading) return <DashboardSkeleton />;
  if (error || !data) return <DashboardErrorPanel />;
  const max = Math.max(...data.dailyRevenue.map((x) => x.value), 1);
  return (
    <main className="w-full min-w-0 space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-nova-muted text-xs">نووا / مرکز کنترل</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            داشبورد مدیریت
          </h1>
          <p className="text-nova-primary mt-2 text-sm">
            نمای لحظه‌ای عملکرد فروشگاه و عملیات روزانه.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/new">
            <Button>محصول جدید</Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline">مدیریت سفارش‌ها</Button>
          </Link>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric
          icon={<CircleDollarSign size={19} />}
          title="فروش"
          value={formatPrice(data.totals.revenue)}
        />
        <DashboardMetric
          icon={<ShoppingCart size={19} />}
          title="سفارش‌ها"
          value={formatNumber(data.totals.orders)}
        />
        <DashboardMetric
          icon={<Users size={19} />}
          title="مشتری‌ها"
          value={formatNumber(data.totals.users)}
        />
        <DashboardMetric
          icon={<Boxes size={19} />}
          title="محصولات"
          value={formatNumber(data.totals.products)}
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.45fr_.55fr]">
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-bold">روند فروش</h2>
                <p className="text-nova-primary mt-1 text-xs">۷ روز اخیر</p>
              </div>
              <BarChart3 className="text-nova-muted" size={20} />
            </div>
            <div className="mt-7 flex h-56 items-end gap-2">
              {data.dailyRevenue.length ? (
                data.dailyRevenue.map((point) => (
                  <div
                    key={point.date}
                    className="flex h-full flex-1 flex-col justify-end gap-2"
                  >
                    <div
                      title={formatPrice(point.value)}
                      className="bg-nova-ink hover:bg-nova-primary w-full rounded-t-xl transition"
                      style={{
                        height: `${Math.max(7, (point.value / max) * 100)}%`,
                      }}
                    />
                    <span className="text-nova-muted text-center text-[10px]">
                      {new Date(point.date).toLocaleDateString('fa-IR', {
                        day: 'numeric',
                        month: 'numeric',
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <DashboardEmptyChart />
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="font-bold">وضعیت سفارش‌ها</h2>
            <div className="mt-4 space-y-2">
              {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <span className="text-sm text-[#475569]">{label}</span>
                  <span className="font-black">
                    {formatNumber(
                      data.statusCounts[
                        key as keyof typeof data.statusCounts
                      ] ?? 0,
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-bold">هشدار موجودی</h2>
              <Link
                href="/admin/inventory"
                className="flex items-center gap-1 text-xs font-semibold"
              >
                مشاهده همه <ArrowLeft size={13} />
              </Link>
            </div>
            {data.lowStock.length ? (
              <div className="mt-4 space-y-3">
                {data.lowStock.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="bg-nova-hover flex items-center justify-between rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-nova-surface rounded-lg p-2">
                        <AlertTriangle size={16} className="text-amber-600" />
                      </span>
                      <span className="text-sm font-medium">
                        {item.product.name}
                      </span>
                    </div>
                    <Badge className="bg-nova-danger-soft text-nova-danger">
                      {formatNumber(item.stock)} عدد
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-nova-muted mt-4 flex flex-col items-center gap-2 py-6 text-center text-sm">
                <PackageSearch size={24} strokeWidth={1.6} />
                <span>موجودی همه محصولات کافی است.</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-bold">پرفروش‌ها</h2>
              <Link
                href="/admin/products"
                className="flex items-center gap-1 text-xs font-semibold"
              >
                محصولات <ArrowLeft size={13} />
              </Link>
            </div>
            {data.topProducts.length ? (
              <div className="mt-4 space-y-3">
                {data.topProducts.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <span className="bg-nova-ink flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {item.name}
                      </p>
                      <p className="text-nova-primary mt-1 text-xs">
                        {formatNumber(item.quantity)} عدد فروش
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-nova-muted mt-4 flex flex-col items-center gap-2 py-6 text-center text-sm">
                <ShoppingCart size={24} strokeWidth={1.6} />
                <span>هنوز فروشی ثبت نشده است.</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
