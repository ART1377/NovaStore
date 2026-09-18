// src/features/home/components/home-hero.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpLeft, Check, Sparkles, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HomePageData } from '../api/home.api';
import { HomeProof } from './home-proof';
import { ProductImagePlaceholder } from '@/components/shared/product-image-placeholder';

type HeroData = HomePageData['hero'];

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeHero({ hero }: { hero: HeroData }) {
  const image = hero?.images[0]?.url ?? null;
  const href = hero ? `/products/${hero.slug}` : '/products';
  const rating = hero?.ratingAverage ?? 4.8;
  const reducedMotion = useReducedMotion() === true;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reveal = (delay = 0) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: reducedMotion ? 0 : 0.72, delay: reducedMotion ? 0 : delay, ease },
  });

  const hidden = { opacity: 0, x: 0, y: 26, scale: 0.98 };

  return (
    <section className="nova-hero relative isolate overflow-hidden border-b border-nova-line bg-nova-surface">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="nova-hero-orb nova-hero-orb-one"
          initial={{ opacity: 0, scale: 0.7, x: 35, y: -20 }}
          animate={mounted ? { opacity: 1, scale: 1, x: 0, y: 0 } : { opacity: 0, scale: 0.7, x: 35, y: -20 }}
          transition={{ duration: reducedMotion ? 0 : 1.1, ease }}
        />
        <motion.div
          className="nova-hero-orb nova-hero-orb-two"
          initial={{ opacity: 0, scale: 0.65, x: -35, y: 30 }}
          animate={mounted ? { opacity: 1, scale: 1, x: 0, y: 0 } : { opacity: 0, scale: 0.65, x: -35, y: 30 }}
          transition={{ duration: reducedMotion ? 0 : 1.2, delay: reducedMotion ? 0 : 0.2, ease }}
        />
        <div className="nova-hero-grid" />
        <motion.div
          className="nova-hero-glow"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={mounted ? { opacity: 1, scale: 1.15 } : { opacity: 0, scale: 0.6 }}
          transition={{ duration: reducedMotion ? 0 : 1.5, delay: reducedMotion ? 0 : 0.1, ease }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-3 py-9 sm:px-4 sm:py-14 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:gap-12 lg:py-16 xl:py-20">
        <motion.div
          className="min-w-0 lg:order-2"
          initial={hidden}
          animate={mounted ? reveal(0.08) : hidden}
        >
          <div className="nova-hero-visual relative mx-auto aspect-[1.04] w-full max-w-[680px]">
            <motion.div
              className="nova-hero-ring absolute inset-[8%] rounded-full border border-nova-primary/15"
              initial={{ opacity: 0, scale: 0.82, rotate: -12 }}
              animate={mounted ? { opacity: 0.7, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.82, rotate: -12 }}
              transition={{ duration: 1.2, delay: 0.35, ease }}
            />
            <motion.div
              className="nova-hero-ring nova-hero-ring-delay absolute inset-[16%] rounded-full border border-nova-accent/15"
              initial={{ opacity: 0, scale: 0.75, rotate: 16 }}
              animate={mounted ? { opacity: 0.95, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.75, rotate: 16 }}
              transition={{ duration: 1.15, delay: 0.48, ease }}
            />

            <motion.div
              className="nova-hero-backdrop absolute inset-[7%] rounded-[38px] bg-nova-ink sm:rounded-[48px]"
              initial={{ opacity: 0, rotate: -10, scale: 0.9, x: 18 }}
              animate={mounted ? { opacity: 1, rotate: -4, scale: 1, x: 0 } : { opacity: 0, rotate: -10, scale: 0.9, x: 18 }}
              whileHover={reducedMotion ? undefined : { rotate: -2.5, scale: 1.015 }}
              transition={{ duration: 0.9, delay: 0.22, ease }}
            />

            <motion.div
              className="absolute inset-[11%] overflow-hidden rounded-[31px] bg-nova-primary/12 sm:rounded-[40px]"
              initial={{ opacity: 0, scale: 0.84 }}
              animate={mounted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.84 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
            >
              <div className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.32),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(254,95,85,.28),transparent_36%)]" />
              <motion.div
                className="absolute inset-x-8 bottom-8 h-28 rounded-full bg-black/25 blur-3xl"
                animate={mounted && !reducedMotion ? { scaleX: [0.9, 1.08, 0.9], opacity: [0.35, 0.52, 0.35] } : undefined}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                initial={{ opacity: 0, y: 42, scale: 0.86, rotate: 3 }}
                animate={mounted ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : { opacity: 0, y: 42, scale: 0.86, rotate: 3 }}
                transition={{ duration: 1.05, delay: 0.48, ease }}
                whileHover={reducedMotion ? undefined : { y: -8, scale: 1.025, rotate: -1 }}
                className="absolute inset-0"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={hero?.name ?? 'محصول منتخب نووا استور'}
                    fill
                    priority
                    className="nova-hero-product object-contain p-7 sm:p-12 lg:p-14"
                    sizes="(max-width:1024px) 92vw, 56vw"
                  />
                ) : (
                  <ProductImagePlaceholder
                    label="تصویر محصول منتخب موجود نیست"
                    className="bg-transparent"
                  />
                )}
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute top-[7%] left-[2%] rounded-2xl border border-white/60 bg-white/88 px-4 py-3 shadow-[0_24px_55px_-28px_rgba(17,24,39,.6)] backdrop-blur-xl dark:border-white/20"
              initial={{ opacity: 0, x: -30, y: 18, scale: 0.8 }}
              animate={mounted ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, x: -30, y: 18, scale: 0.8 }}
              transition={{ duration: 0.75, delay: 0.8, ease }}
              whileHover={reducedMotion ? undefined : { y: -7, scale: 1.035 }}
            >
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-nova-accent/12 text-nova-accent">
                  <Star size={15} fill="currentColor" />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-nova-muted">امتیاز مشتری‌ها</p>
                  <p className="mt-0.5 text-sm font-black text-nova-ink">{rating.toFixed(1)} / 5</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute right-[1%] bottom-[10%] rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-[0_24px_55px_-28px_rgba(17,24,39,.6)] backdrop-blur-xl"
              initial={{ opacity: 0, x: 32, y: 22, scale: 0.8 }}
              animate={mounted ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, x: 32, y: 22, scale: 0.8 }}
              transition={{ duration: 0.78, delay: 1.0, ease }}
              whileHover={reducedMotion ? undefined : { y: -8, scale: 1.035 }}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-xl bg-nova-primary text-white">
                  <Truck size={15} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-nova-muted">ارسال قابل پیگیری</p>
                  <p className="mt-0.5 text-xs font-black text-nova-ink">مطمئن تا لحظه تحویل</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 18 }}
              animate={mounted ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.75, y: 18 }}
              transition={{ duration: 0.72, delay: 1.15, ease }}
              whileHover={reducedMotion ? undefined : { y: -5, scale: 1.04 }}
              className="absolute right-[4%] top-[47%]"
            >
              <Link
                href={href}
                className="group flex items-center gap-2 rounded-full border border-white/40 bg-nova-ink/90 px-4 py-2.5 text-[11px] font-black text-white shadow-2xl backdrop-blur-xl"
              >
                مشاهده محصول
                <motion.span whileHover={{ x: -3, y: -3 }}>
                  <ArrowUpLeft size={15} />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              className="absolute right-[8%] bottom-[4%] left-[8%] rounded-[24px] border border-white/15 bg-nova-ink/92 p-4 text-white shadow-[0_25px_70px_-30px_rgba(0,0,0,.65)] backdrop-blur-xl sm:p-5"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={mounted ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.94 }}
              transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 1.28, ease }}
            >
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-white/50">انتخاب امروز نووا</p>
                  <p className="mt-1 truncate text-sm font-black sm:text-base">{hero?.name ?? 'محصول منتخب نووا'}</p>
                </div>
                <div className="shrink-0 rounded-xl bg-white/10 px-3 py-2 text-left">
                  <p className="text-[9px] text-white/45">رضایت</p>
                  <p className="text-sm font-black">{Math.round(rating * 20)}٪</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="min-w-0 lg:order-1"
          initial={hidden}
          animate={mounted ? reveal(0) : hidden}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-nova-primary/15 bg-white/60 px-3.5 py-2 text-[11px] font-bold text-nova-primary shadow-sm backdrop-blur"
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={mounted ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.92 }}
            transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : 0.15, ease }}
          >
            <motion.span
              animate={mounted && !reducedMotion ? { rotate: [0, 14, -8, 0], scale: [1, 1.16, 0.98, 1] } : undefined}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
              className="inline-flex"
            >
              <Sparkles size={14} className="text-nova-accent" />
            </motion.span>
            انتخاب‌های دقیق برای آدم‌های سخت‌پسند
          </motion.div>

          <motion.p
            className="text-nova-primary mt-6 text-xs font-bold tracking-[.14em]"
            initial={{ opacity: 0, x: 24 }}
            animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 0.65, delay: 0.3, ease }}
          >
            فروشگاه اینترنتی نووا استور
          </motion.p>

          <motion.h1
            className="text-nova-ink mt-3 max-w-2xl text-4xl leading-[1.23] font-black tracking-[-.055em] sm:text-5xl lg:text-6xl xl:text-7xl"
            initial={{ opacity: 0, x: 34, filter: 'blur(8px)' }}
            animate={mounted ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: 34, filter: 'blur(8px)' }}
            transition={{ duration: 0.85, delay: 0.38, ease }}
          >
            کمتر بگرد.
            <br />
            <span className="nova-accent">بهتر انتخاب کن.</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-xl text-sm leading-8 text-nova-primary sm:text-base"
            initial={{ opacity: 0, x: 26 }}
            animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 26 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
          >
            محصولات منتخب، اطلاعات شفاف و تجربه‌ای که از اولین کلیک تا تحویل سفارش، حس یک خرید حرفه‌ای را منتقل می‌کند.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 22 }}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.72, delay: 0.72, ease }}
          >
            <motion.div whileHover={reducedMotion ? undefined : { y: -4, scale: 1.025 }} whileTap={{ scale: 0.97 }}>
              <Link href="/products">
                <Button size="lg" className="h-13 w-full px-6 text-sm font-black sm:w-auto">
                  شروع خرید <ArrowLeft size={17} />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={reducedMotion ? undefined : { y: -4, scale: 1.025 }} whileTap={{ scale: 0.97 }}>
              <Link href={href}>
                <Button size="lg" variant="outline" className="h-13 w-full px-6 text-sm font-black sm:w-auto">
                  انتخاب امروز <ArrowUpLeft size={17} />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 grid gap-2 text-xs sm:grid-cols-3"
            initial={{ opacity: 0, y: 18 }}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: reducedMotion ? 0 : 0.72, delay: reducedMotion ? 0 : 0.88, ease }}
          >
            <HomeProof text="قیمت نهایی از سمت سرور" icon={<Check size={13} />} />
            <HomeProof text="موجودی واقعی" icon={<Check size={13} />} />
            <HomeProof text="رهگیری سفارش" icon={<Check size={13} />} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
