// src/components/layout/footer.tsx
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, ArrowUpLeft } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-nova-soft bg-nova-ink mt-20 shrink-0 border-t text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-nova-ink grid size-9 place-items-center rounded-xl bg-white text-xs font-black">
                N
              </span>
              <div className="text-xl font-black tracking-[-.04em]">
                نووا<span className="text-nova-soft">استور</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-8 text-white/60">
              یک تجربه خرید دقیق و بدون شلوغی؛ محصول، قیمت، موجودی و مسیر سفارش
              را شفاف و ساده نگه می‌داریم.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70">
              <span className="bg-nova-soft size-1.5 rounded-full" /> خرید
              آنلاین با تمرکز روی تجربه کاربر
            </div>
          </div>
          <div>
            <h3 className="font-bold">خرید</h3>
            <div className="mt-4 grid gap-2.5 text-sm text-white/60">
              <Link href="/products">همه محصولات</Link>
              <Link href="/products?sort=newest">تازه‌ترین‌ها</Link>
              <Link href="/products?sort=popular">پرفروش‌ها</Link>
              <Link href="/products?discounted=true">پیشنهاد ویژه</Link>
              <Link href="/compare">مقایسه محصولات</Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold">خدمات مشتری</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Truck size={16} />
                ارسال سریع و قابل پیگیری
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} />
                پشتیبانی پس از خرید
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} />
                پرداخت امن
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold">راهنما</h3>
            <div className="mt-4 grid gap-2.5 text-sm text-white/60">
              <Link href="/faq">سوالات متداول</Link>
              <Link href="/shipping">ارسال و مرجوعی</Link>
              <Link href="/terms">قوانین استفاده</Link>
              <Link href="/privacy">حریم خصوصی</Link>
            </div>
            <p className="mt-4 text-xs leading-6 text-white/40">
              پشتیبانی هر روز از ۹ تا ۲۱
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© ۱۴۰۵ نووا استور</span>
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 hover:text-white/70"
          >
            راهنمای خرید <ArrowUpLeft size={12} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
