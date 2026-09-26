// src/components/layout/header.tsx
'use client';

import { ThemeSwitcher } from '@/components/layout/theme-switcher';
import { useCart } from '@/features/cart/hooks/use-cart';
import { useNotifications } from '@/features/notifications/hooks/use-notifications';
import {
  ArrowUpLeft,
  Bell,
  GitCompareArrows,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const { unread } = useNotifications();
  const { data: cart } = useCart();
  const cartCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const links = [
    ['/products', 'فروشگاه'],
    ['/products?sort=newest', 'تازه‌ها'],
    ['/products?sort=popular', 'پرفروش‌ها'],
    ['/products?discounted=true', 'پیشنهاد ویژه'],
  ] as const;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className="border-nova-soft/90 bg-nova-surface/90 sticky top-0 z-[70] border-b backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="flex h-[72px] items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="border-nova-line text-nova-ink hover:bg-nova-hover inline-flex shrink-0 rounded-2xl border p-2.5 transition md:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link
              href="/"
              className="group min-w-0 shrink-0"
              onClick={closeMenu}
            >
              <div className="flex items-center gap-2">
                <span className="bg-nova-ink grid size-9 shrink-0 place-items-center rounded-xl text-xs font-black text-white shadow-[0_10px_24px_-12px_rgba(17,24,39,.8)]">
                  N
                </span>
                <span className="text-nova-ink text-xl font-black tracking-[-.04em] sm:text-[22px]">
                  نووا<span className="nova-accent">استور</span>
                </span>
              </div>
            </Link>

            <nav
              aria-label="ناوبری اصلی"
              className="mr-6 hidden items-center gap-1 md:flex"
            >
              {links.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-nova-primary hover:bg-nova-hover hover:text-nova-ink rounded-xl px-3.5 py-2 text-sm font-medium transition"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mr-auto flex min-w-0 items-center gap-1 sm:gap-1.5">
              <div className="hidden sm:block">
                <ThemeSwitcher />
              </div>

              <Link
                href="/products"
                aria-label="جستجوی محصولات"
                title="جستجوی محصولات"
                onClick={closeMenu}
                className="text-nova-ink hover:border-nova-line hover:bg-nova-hover rounded-2xl border border-transparent p-2.5 transition"
              >
                <Search size={18} />
              </Link>

              <Link
                href="/account/wishlist"
                aria-label="علاقه‌مندی‌ها"
                title="علاقه‌مندی‌ها"
                onClick={closeMenu}
                className="text-nova-ink hover:border-nova-line hover:bg-nova-hover hidden rounded-2xl border border-transparent p-2.5 transition sm:inline-flex"
              >
                <Heart size={18} />
              </Link>

              <Link
                href="/compare"
                aria-label="مقایسه محصولات"
                title="مقایسه محصولات"
                onClick={closeMenu}
                className="text-nova-ink hover:border-nova-line hover:bg-nova-hover hidden rounded-2xl border border-transparent p-2.5 transition sm:inline-flex"
              >
                <GitCompareArrows size={18} />
              </Link>

              {session && (
                <Link
                  href="/notifications"
                  aria-label="اعلان‌ها"
                  title="اعلان‌ها"
                  onClick={closeMenu}
                  className="text-nova-ink hover:border-nova-line hover:bg-nova-hover relative hidden rounded-2xl border border-transparent p-2.5 transition sm:inline-flex"
                >
                  <Bell size={18} />
                  {unread > 0 && (
                    <span className="bg-nova-primary absolute -top-0.5 -right-0.5 min-w-4 rounded-full px-1 text-center text-[9px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </Link>
              )}

              {session?.user.role === 'ADMIN' ? (
                <>
                  <Link
                    href="/cart"
                    aria-label="سبد خرید"
                    title="سبد خرید"
                    onClick={closeMenu}
                    className="bg-nova-ink relative hidden shrink-0 rounded-2xl p-2.5 text-white shadow-[0_12px_26px_-14px_rgba(17,24,39,.75)] transition hover:-translate-y-0.5 md:inline-flex"
                  >
                    <ShoppingBag size={18} />
                    {cartCount > 0 && (
                      <span className="bg-nova-primary ring-nova-surface absolute -top-1 -right-1 min-w-5 rounded-full px-1 text-center text-[9px] font-bold text-white ring-2">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/admin"
                    aria-label="مدیریت"
                    title="پنل مدیریت"
                    onClick={closeMenu}
                    className="border-nova-line-strong text-nova-ink hover:bg-nova-hover inline-flex shrink-0 rounded-2xl border p-2.5 transition"
                  >
                    <ShieldCheck size={18} />
                  </Link>
                </>
              ) : (
                <Link
                  href="/cart"
                  aria-label="سبد خرید"
                  title="سبد خرید"
                  onClick={closeMenu}
                  className="bg-nova-ink relative shrink-0 rounded-2xl p-2.5 text-white shadow-[0_12px_26px_-14px_rgba(17,24,39,.75)] transition hover:-translate-y-0.5"
                >
                  <ShoppingBag size={18} />
                  {cartCount > 0 && (
                    <span className="bg-nova-primary ring-nova-surface absolute -top-1 -right-1 min-w-5 rounded-full px-1 text-center text-[9px] font-bold text-white ring-2">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              <Link
                href={session ? '/account' : '/login'}
                aria-label="حساب کاربری"
                title="حساب کاربری"
                onClick={closeMenu}
                className="border-nova-line-strong bg-nova-surface text-nova-ink hover:bg-nova-hover shrink-0 rounded-2xl border p-2.5 transition"
              >
                <UserRound size={18} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <>
          <button
            type="button"
            aria-label="بستن منوی موبایل"
            onClick={closeMenu}
            className="fixed inset-x-0 top-[72px] bottom-0 z-[60] cursor-default bg-black/35 backdrop-blur-[2px] md:hidden"
          />

          <aside
            id="mobile-navigation"
            aria-label="منوی موبایل"
            className="bg-nova-surface border-nova-line fixed inset-x-0 top-[72px] bottom-0 z-[65] overflow-y-auto border-t shadow-[0_28px_70px_-30px_rgba(17,24,39,.45)] md:hidden"
          >
            <div className="mx-auto w-full max-w-7xl px-3 py-4 pb-8 sm:px-4">
              <nav className="grid gap-1.5" aria-label="ناوبری فروشگاه">
                {links.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    className="text-nova-ink hover:bg-nova-hover flex min-h-12 items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold transition active:scale-[.99]"
                  >
                    <span>{label}</span>
                    <ArrowUpLeft size={16} />
                  </Link>
                ))}
              </nav>

              <div className="border-nova-line mt-3 border-t pt-3">
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {session?.user.role === 'ADMIN' && (
                    <Link
                      href="/cart"
                      onClick={closeMenu}
                      className="text-nova-ink hover:bg-nova-hover flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition"
                    >
                      <ShoppingBag size={17} />
                      <span>سبد خرید</span>
                      {cartCount > 0 && (
                        <span className="bg-nova-primary mr-auto min-w-6 rounded-full px-1.5 py-1 text-center text-[10px] font-bold text-white">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  )}
                  <Link
                    href="/account/wishlist"
                    onClick={closeMenu}
                    className="text-nova-ink hover:bg-nova-hover flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition"
                  >
                    <Heart size={17} />
                    <span>علاقه‌مندی‌ها</span>
                  </Link>

                  <Link
                    href="/compare"
                    onClick={closeMenu}
                    className="text-nova-ink hover:bg-nova-hover flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition"
                  >
                    <GitCompareArrows size={17} />
                    <span>مقایسه محصولات</span>
                  </Link>

                  {session && (
                    <Link
                      href="/notifications"
                      onClick={closeMenu}
                      className="text-nova-ink hover:bg-nova-hover flex min-h-12 items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition"
                    >
                      <span className="flex items-center gap-3">
                        <Bell size={17} />
                        <span>اعلان‌ها</span>
                      </span>
                      {unread > 0 && (
                        <span className="bg-nova-primary min-w-6 rounded-full px-1.5 py-1 text-center text-[10px] font-bold text-white">
                          {unread}
                        </span>
                      )}
                    </Link>
                  )}

                  {session?.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className="text-nova-ink border-nova-line hover:bg-nova-hover flex min-h-12 items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-bold transition"
                    >
                      <ShieldCheck size={17} />
                      <span>پنل مدیریت</span>
                    </Link>
                  )}

                  <Link
                    href={session ? '/account' : '/login'}
                    onClick={closeMenu}
                    className="text-nova-ink border-nova-line hover:bg-nova-hover flex min-h-12 items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-bold transition sm:col-span-2"
                  >
                    <UserRound size={17} />
                    <span>{session ? 'حساب کاربری' : 'ورود / ثبت‌نام'}</span>
                  </Link>
                </div>
              </div>

              <div className="border-nova-line mt-3 border-t pt-3 sm:hidden">
                <div className="flex items-center justify-between gap-3 rounded-2xl border p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold">تم فروشگاه</p>
                    <p className="text-nova-muted mt-1 text-[11px]">
                      ظاهر نووا را تغییر بده
                    </p>
                  </div>
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
