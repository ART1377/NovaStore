// src/features/notifications/components/notifications-page.tsx
'use client';
import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared';
import { formatDateTime } from '@/lib/utils';
export function NotificationsPage() {
  const { items, unread, read, readAll, isLoading } = useNotifications();
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-nova-primary text-xs">نووا / اعلان‌ها</p>
          <h1 className="mt-2 text-4xl font-black">اعلان‌ها</h1>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={readAll}>
            <CheckCheck size={15} />
            خواندن همه
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-4 rounded-2xl border p-4">
              <Skeleton className="size-11 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-full max-w-md" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className={item.isRead ? '' : 'border-nova-primary'}
            >
              <CardContent className="flex gap-4">
                <div className="bg-nova-soft rounded-xl p-3">
                  <Bell size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <h2 className="font-bold">{item.title}</h2>
                    {!item.isRead && (
                      <span className="bg-nova-danger mt-1 h-2 w-2 rounded-full" />
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-7 text-[#475569]">
                    {item.message}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-nova-muted text-xs">
                      {formatDateTime(item.createdAt)}
                    </span>
                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => read(item.id)}
                        className="text-xs font-semibold underline"
                      >
                        مشاهده
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!items.length && (
            <EmptyState
              icon={Bell}
              title="اعلانی ندارید"
              description="تازه‌ترین اطلاعیه‌های سفارش، تخفیف و حساب کاربری‌تان اینجا نمایش داده می‌شود."
            />
          )}
        </div>
      )}
    </main>
  );
}
