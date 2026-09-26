// src/features/admin/components/users-page.tsx
'use client';
import { SearchField } from '@/components/shared';
import { QueryEmpty, QueryError } from '@/components/shared/query-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { formatNumber } from '@/lib/utils';
import { ShieldCheck, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAdminUserActions, useAdminUsers } from '../hooks/use-admin';
import { AdminListSkeleton } from './admin-list-skeleton';
import { AdminFilterGrid, AdminPageHeader } from './admin-page-header';
import { AdminPagination } from './admin-pagination';

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminUsers({
    page,
  });
  const { updateRole: update } = useAdminUserActions();

  const list = (data?.items ?? []).filter(
    (user) =>
      (role === 'ALL' || user.role === role) &&
      `${user.name ?? ''} ${user.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  if (isLoading)
    return <AdminListSkeleton rows={6} withThumbnail withStats={false} />;
  if (isError)
    return (
      <QueryError
        message="دریافت کاربران ناموفق بود."
        onRetry={() => refetch()}
      />
    );

  return (
    <main className="w-full min-w-0">
      <AdminPageHeader
        eyebrow="مدیریت / مشتری‌ها"
        title="مشتری‌ها و کاربران"
        description="نمایش فعالیت خرید، نظرات و مدیریت نقش‌ها."
        controls={
          <AdminFilterGrid>
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="جستجو بر اساس نام یا ایمیل..."
            />
            <Select
              className="w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ALL">همه نقش‌ها</option>
              <option value="USER">کاربر</option>
              <option value="ADMIN">مدیر</option>
            </Select>
          </AdminFilterGrid>
        }
      />
      <Card className="mt-6">
        <CardContent className="p-0">
          <div
            className={`divide-y transition-opacity ${isFetching ? 'opacity-60' : ''}`}
          >
            {list.map((u) => (
              <article
                key={u.id}
                className="grid min-w-0 gap-4 p-4 md:grid-cols-[minmax(0,1fr)_180px_minmax(250px,auto)] md:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="bg-nova-soft grid size-11 shrink-0 place-items-center rounded-2xl">
                    {u.role === 'ADMIN' ? (
                      <ShieldCheck size={18} />
                    ) : (
                      <UserRound size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold">
                        {u.name ?? 'بدون نام'}
                      </p>
                      <Badge>{u.role === 'ADMIN' ? 'مدیر' : 'کاربر'}</Badge>
                    </div>
                    <p className="text-nova-primary mt-1 truncate text-xs">
                      {u.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-nova-hover rounded-xl p-2.5">
                    <span className="text-nova-muted">سفارش</span>
                    <b className="mt-1 block">
                      {formatNumber(u._count.orders)}
                    </b>
                  </div>
                  <div className="bg-nova-hover rounded-xl p-2.5">
                    <span className="text-nova-muted">نظر</span>
                    <b className="mt-1 block">
                      {formatNumber(u._count.reviews)}
                    </b>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(140px,1fr)_auto] md:grid-cols-[140px_auto]">
                  <Select
                    className="h-10 w-full"
                    value={u.role}
                    onChange={(e) =>
                      update.mutate({
                        userId: u.id,
                        role: e.target.value as 'USER' | 'ADMIN',
                      })
                    }
                  >
                    <option value="USER">کاربر</option>
                    <option value="ADMIN">مدیر</option>
                  </Select>
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full" size="sm" variant="outline">
                      جزئیات کاربر
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
            {!list.length && (
              <QueryEmpty
                title="کاربری پیدا نشد"
                description="جستجو یا فیلتر نقش را تغییر بده."
              />
            )}
          </div>
        </CardContent>
      </Card>
      {data && (
        <AdminPagination
          page={data.page}
          hasMore={data.hasMore}
          isFetching={isFetching}
          onPageChange={setPage}
        />
      )}
    </main>
  );
}
