// src/features/admin/components/admin-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  TicketPercent,
  Home,
  Boxes,
  MessageSquareText,
  PanelsTopLeft,
} from 'lucide-react';

const links = [
  ['/admin', 'داشبورد', LayoutDashboard],
  ['/admin/products', 'محصولات', Package],
  ['/admin/home', 'ویترین صفحه اصلی', PanelsTopLeft],
  ['/admin/inventory', 'موجودی انبار', Boxes],
  ['/admin/orders', 'سفارش‌ها', ShoppingCart],
  ['/admin/users', 'مشتری‌ها', Users],
  ['/admin/reviews', 'نظرات', MessageSquareText],
  ['/admin/categories', 'دسته‌بندی‌ها', Tags],
  ['/admin/brands', 'برندها', Tags],
  ['/admin/coupons', 'کدهای تخفیف', TicketPercent],
] as const;

function isActivePath(pathname: string, href: string) {
  return href === '/admin'
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <>
      <aside className="admin-sidebar bg-nova-surface hidden w-60 min-w-60 max-w-60 shrink-0 self-start overflow-y-auto rounded-3xl border p-3 shadow-sm xl:sticky xl:top-24 xl:block">
        <div className="border-b px-3 pb-4">
          <p className="text-nova-muted text-xs">نووا / مدیریت</p>
          <div className="mt-1 text-xl font-black">مرکز کنترل فروشگاه</div>
          <p className="text-nova-muted mt-2 text-xs">
            مدیریت فروش، انبار و مشتری
          </p>
        </div>
        <nav className="mt-3 space-y-1">
          {links.map(([href, label, Icon]) => {
            const active = isActivePath(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={
                  active
                    ? 'bg-nova-ink flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white shadow-sm transition'
                    : 'hover:bg-nova-hover text-nova-primary flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition'
                }
              >
                <Icon size={17} />
                <span className="flex-1">{label}</span>
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="mt-4 flex items-center gap-3 rounded-xl border px-3 py-3 text-sm"
        >
          <Home size={17} />
          بازگشت به فروشگاه
        </Link>
      </aside>
      <div className="bg-nova-surface flex w-full min-w-0 gap-2 overflow-x-auto rounded-2xl border p-2 xl:hidden">
        {links.map(([href, label, Icon]) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={
                active
                  ? 'bg-nova-ink flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-white'
                  : 'hover:bg-nova-hover flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold'
              }
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
