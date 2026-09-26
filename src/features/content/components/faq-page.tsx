// src/features/content/components/faq-page.tsx
'use client';
import { Card } from '@/components/ui/card';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useState } from 'react';
const faqs = [
  [
    'چطور سفارش خودم را پیگیری کنم؟',
    'بعد از ثبت سفارش از بخش سفارش‌های من، سفارش را باز کن. در صفحه جزئیات، وضعیت مرحله‌به‌مرحله و کد رهگیری نمایش داده می‌شود.',
  ],
  [
    'آیا قیمت و موجودی لحظه‌ای هستند؟',
    'بله. قیمت نهایی و موجودی هنگام ثبت سفارش دوباره در سمت سرور بررسی می‌شوند تا تغییرات کلاینت قابل اعتماد نباشد.',
  ],
  [
    'هزینه ارسال چطور محاسبه می‌شود؟',
    'در مرحله تسویه می‌توانی روش ارسال را انتخاب کنی. سفارش‌های واجد شرایط از ارسال رایگان استفاده می‌کنند.',
  ],
  [
    'چطور محصول را به علاقه‌مندی اضافه کنم؟',
    'روی قلب محصول بزن. برای ذخیره دائمی علاقه‌مندی‌ها باید وارد حساب کاربری باشی.',
  ],
  [
    'آیا امکان مقایسه محصولات وجود دارد؟',
    'بله. از دکمه مقایسه روی کارت محصول استفاده کن و حداکثر چهار محصول را کنار هم ببین.',
  ],
];
export function FAQPage() {
  const [open, setOpen] = useState(0);
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <div className="bg-nova-soft mx-auto inline-flex rounded-2xl p-3">
          <MessageCircle size={22} />
        </div>
        <p className="text-nova-muted mt-4 text-xs">پشتیبانی و راهنمای خرید</p>
        <h1 className="mt-2 text-4xl font-black">سؤالات متداول</h1>
        <p className="text-nova-primary mx-auto mt-3 max-w-2xl text-sm leading-7">
          پاسخ سریع به پرسش‌هایی که قبل و بعد از خرید ممکن است داشته باشی.
        </p>
      </div>
      <div className="mt-10 space-y-3">
        {faqs.map(([q, a], i) => (
          <Card key={q} className="overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-right"
            >
              <span className="font-bold">{q}</span>
              <ChevronDown
                className={`shrink-0 transition ${open === i ? 'rotate-180' : ''}`}
                size={18}
              />
            </button>
            {open === i ? (
              <div className="border-t px-5 pt-4 pb-5 text-sm leading-8 text-[#475569]">
                {a}
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </main>
  );
}
