// src/features/home/components/home-page.tsx
import { Button } from '@/components/ui/button';
import { RecentlyViewedSection } from '@/features/recently-viewed/components/recently-viewed-section';
import {
  ArrowLeft,
  ArrowUpLeft,
  Headphones,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import type { HomePageData } from '../api/home.api';
import { HomeHero } from './home-hero';
import { HomeProductSection } from './home-product-section';
import { HomeSectionHeader } from './home-section-header';
import { HomeTrustItem } from './home-trust-item';

export function HomePage({ data }: { data: HomePageData }) {
  const { hero, featured, newest, discounted, categories, best } = data;
  return (
    <main className="overflow-hidden">
      <HomeHero hero={hero} />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-3 py-6 sm:grid-cols-3 sm:px-4 sm:py-9">
        <HomeTrustItem
          icon={<Truck size={19} />}
          title="ارسال قابل پیگیری"
          text="روش ارسال مناسب خودت را انتخاب کن"
        />
        <HomeTrustItem
          icon={<ShieldCheck size={19} />}
          title="خرید مطمئن"
          text="قیمت و موجودی پیش از سفارش کنترل می‌شود"
        />
        <HomeTrustItem
          icon={<Headphones size={19} />}
          title="پشتیبانی انسانی"
          text="در مسیر خرید تنها نمی‌مانی"
        />
      </section>

      <section className="mx-auto max-w-7xl px-3 py-7 sm:px-4 sm:py-10">
        <HomeSectionHeader
          label="دسته‌بندی سریع"
          title="از جایی شروع کن که به کارت می‌آید"
          href="/products"
        />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, index) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="group border-nova-line bg-nova-surface relative overflow-hidden rounded-[22px] border p-4 transition duration-200 hover:-translate-y-1 hover:border-[#c7cfff] hover:shadow-[0_20px_45px_-30px_rgba(17,24,39,.35)] sm:p-5"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="bg-nova-soft/60 text-nova-ink grid size-9 place-items-center rounded-xl text-xs font-black">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <ArrowUpLeft
                  size={15}
                  className="text-nova-muted group-hover:text-nova-primary transition group-hover:-translate-x-1 group-hover:-translate-y-1"
                />
              </div>
              <span className="text-sm font-black text-[#1d2636]">
                {c.name}
              </span>
              <span className="text-nova-muted mt-1 block text-[11px]">
                مشاهده محصولات
              </span>
            </Link>
          ))}
        </div>
      </section>

      <HomeProductSection
        label="منتخب"
        title="برای شروع، این‌ها را ببین"
        href="/products"
        products={featured}
      />
      <section className="mx-auto max-w-7xl px-3 py-7 sm:px-4 sm:py-10">
        <div className="bg-nova-ink overflow-hidden rounded-[30px] text-white sm:rounded-[36px]">
          <div className="grid lg:grid-cols-[1fr_.85fr]">
            <div className="p-7 sm:p-10 md:p-14">
              <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                <Zap size={14} /> پیشنهادهای هوشمند
              </div>
              <h2 className="mt-3 max-w-xl text-3xl leading-tight font-black tracking-[-.04em] sm:text-4xl md:text-5xl">
                چیزهایی که ارزش خرید بیشتری دارند.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">
                تخفیف‌ها و انتخاب‌های محبوب را یک‌جا ببین و راحت‌تر تصمیم بگیر.
              </p>
              <Link
                href="/products?discounted=true"
                className="mt-6 inline-flex"
              >
                <Button
                  size="lg"
                  className="text-nova-ink bg-white hover:bg-[#f0f5f9]"
                >
                  دیدن پیشنهادها <ArrowLeft size={16} />
                </Button>
              </Link>
            </div>
            <div className="bg-nova-primary hidden min-h-[250px] p-8 lg:grid lg:place-items-center">
              <div className="max-w-xs rounded-[26px] border border-white/15 bg-white/10 p-6 backdrop-blur">
                <ShoppingBag size={24} />
                <p className="mt-5 text-lg font-black">
                  تخفیف را ساده پیدا کن.
                </p>
                <p className="mt-2 text-xs leading-6 text-white/65">
                  فیلتر تخفیف‌دار همیشه فقط یک کلیک فاصله دارد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <HomeProductSection
        label="پیشنهاد ویژه"
        title="محصولاتی که امروز ارزش بیشتری دارند"
        href="/products?discounted=true"
        products={discounted}
      />
      <HomeProductSection
        label="پرفروش‌ترین‌ها"
        title="انتخاب‌هایی که مشتری‌ها تکرار می‌کنند"
        href="/products?sort=popular"
        products={best}
      />
      <HomeProductSection
        label="تازه رسیده"
        title="محصولات جدید، قبل از شلوغ‌شدن"
        href="/products?sort=newest"
        products={newest}
      />
      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4 sm:py-14">
        <div className="border-nova-line bg-nova-surface rounded-[30px] border p-6 sm:p-9">
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-nova-primary text-xs font-bold">
                عضویت در باشگاه نووا
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-.03em] sm:text-3xl">
                قبل از بقیه از پیشنهادها باخبر شو.
              </h2>
              <p className="text-nova-primary mt-2 max-w-2xl text-sm leading-7">
                برای خبرهای جدید و پیشنهادهای اختصاصی ایمیلت را ثبت کن.
              </p>
            </div>
            <div className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
              <Link href="/products?discounted=true" className="inline-flex">
                <Button className="h-12 w-full sm:w-auto">
                  مشاهده پیشنهادها <ArrowLeft size={16} />
                </Button>
              </Link>
              <Link href="/products?sort=newest" className="inline-flex">
                <Button variant="outline" className="h-12 w-full sm:w-auto">
                  تازه‌ترین محصولات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <RecentlyViewedSection />
    </main>
  );
}
