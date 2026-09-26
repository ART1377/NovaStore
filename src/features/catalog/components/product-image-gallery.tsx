// src/features/catalog/components/product-image-gallery.tsx
'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Expand, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { ProductImagePlaceholder } from '@/components/shared/product-image-placeholder';
import { cn, formatNumber } from '@/lib/utils';
import type { Product } from '../types/catalog-types';
import { GalleryArrow } from './gallery-arrow';

type GalleryImage = Product['images'][number];

type Props = {
  images: GalleryImage[];
  productName: string;
  compact?: boolean;
};

const imageTransition = {
  duration: 0.34,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function ProductImageGallery({
  images,
  productName,
  compact = false,
}: Props) {
  const items = useMemo(() => images, [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [direction, setDirection] = useState(0);
  const reducedMotion = useReducedMotion() === true;

  const safeIndex = Math.min(activeIndex, Math.max(items.length - 1, 0));
  const activeImage = items[safeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (!items.length) return;
      const nextIndex = (index + items.length) % items.length;
      setDirection(nextIndex > safeIndex ? 1 : nextIndex < safeIndex ? -1 : 0);
      setActiveIndex(nextIndex);
    },
    [safeIndex, items.length],
  );

  const goNext = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);
  const goPrevious = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);

  // Lightbox: body-scroll lock and keyboard navigation. Real external-system
  // synchronization, so effects are the correct tool here.
  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (items.length > 1 && event.key === 'ArrowLeft') goNext();
      if (items.length > 1 && event.key === 'ArrowRight') goPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goNext, goPrevious, items.length, lightboxOpen]);

  const imageVariants = reducedMotion
    ? {
        enter: { opacity: 1, x: 0, scale: 1 },
        center: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: 0, scale: 1 },
      }
    : {
        enter: (slideDirection: number) => ({
          opacity: 0,
          x: slideDirection > 0 ? 36 : -36,
          scale: 0.985,
        }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: (slideDirection: number) => ({
          opacity: 0,
          x: slideDirection > 0 ? -36 : 36,
          scale: 1.01,
        }),
      };

  return (
    <>
      <div className={cn('min-w-0', compact && 'space-y-2')}>
        <div className="group border-nova-line bg-nova-hover relative aspect-square overflow-hidden rounded-[28px] border shadow-sm">
          {activeImage?.url ? (
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeImage.id}
                className="absolute inset-0"
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={imageTransition}
              >
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt ?? productName}
                  fill
                  priority={!compact}
                  className="object-cover transition duration-500 group-hover:scale-[1.015]"
                  sizes={
                    compact
                      ? '(max-width: 640px) 100vw, 480px'
                      : '(max-width: 1024px) 100vw, 52vw'
                  }
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <ProductImagePlaceholder label="تصویر محصول موجود نیست" />
          )}

          {items.length > 1 ? (
            <>
              <GalleryArrow direction="previous" onClick={goPrevious} />
              <GalleryArrow direction="next" onClick={goNext} />
              <div className="bg-nova-ink/70 absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {formatNumber(safeIndex + 1)} / {formatNumber(items.length)}
              </div>
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="border-nova-line bg-nova-paper/95 text-nova-ink hover:bg-nova-paper absolute right-3 bottom-3 rounded-full border p-2.5 opacity-0 shadow-sm transition group-hover:opacity-100 focus-visible:opacity-100"
            aria-label="نمایش بزرگ تصویر"
          >
            <Expand size={15} />
          </button>
        </div>

        {items.length > 1 ? (
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
            {items.map((image, index) => (
              <motion.button
                key={image.id}
                type="button"
                onClick={() => goTo(index)}
                whileHover={reducedMotion ? undefined : { y: -2 }}
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                className={cn(
                  'bg-nova-hover relative aspect-square overflow-hidden rounded-xl border transition',
                  index === safeIndex
                    ? 'border-nova-ink ring-nova-ink/10 ring-2'
                    : 'border-nova-line hover:border-nova-line-strong',
                )}
                aria-label={`تصویر ${index + 1}`}
                aria-current={index === safeIndex}
              >
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt ?? productName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <ProductImagePlaceholder compact label="بدون تصویر" />
                )}
              </motion.button>
            ))}
          </div>
        ) : null}
      </div>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {lightboxOpen ? (
                <motion.div
                  className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6"
                  role="dialog"
                  aria-modal="true"
                  aria-label={`گالری ${productName}`}
                  initial={reducedMotion ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onMouseDown={(event) => {
                    if (event.target === event.currentTarget)
                      setLightboxOpen(false);
                  }}
                >
                  <motion.div
                    className="relative flex h-full max-h-[94vh] w-full max-w-6xl flex-col items-center justify-center gap-3 sm:gap-4"
                    initial={
                      reducedMotion
                        ? undefined
                        : { opacity: 0, y: 18, scale: 0.985 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={
                      reducedMotion
                        ? undefined
                        : { opacity: 0, y: 12, scale: 0.985 }
                    }
                    transition={{
                      duration: 0.28,
                      ease: imageTransition.ease,
                    }}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(false)}
                      className="absolute top-0 left-0 z-20 grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-sm backdrop-blur transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60 sm:top-2 sm:left-2"
                      aria-label="بستن"
                    >
                      <X size={20} />
                    </button>

                    <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-[28px] bg-black/25">
                      <AnimatePresence initial={false} mode="wait">
                        {activeImage?.url ? (
                          <motion.div
                            key={activeImage.id}
                            className="absolute inset-0"
                            custom={direction}
                            variants={imageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={imageTransition}
                          >
                            <Image
                              src={activeImage.url}
                              alt={activeImage.alt ?? productName}
                              fill
                              className="object-contain"
                              sizes="100vw"
                              priority
                            />
                          </motion.div>
                        ) : (
                          <ProductImagePlaceholder label="تصویر محصول موجود نیست" />
                        )}
                      </AnimatePresence>

                      {items.length > 1 ? (
                        <>
                          <GalleryArrow
                            direction="previous"
                            onClick={goPrevious}
                            lightbox
                          />
                          <GalleryArrow
                            direction="next"
                            onClick={goNext}
                            lightbox
                          />
                        </>
                      ) : null}

                      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                        {formatNumber(safeIndex + 1)} /{' '}
                        {formatNumber(items.length || 1)}
                      </div>
                    </div>

                    {items.length > 1 ? (
                      <div className="w-full shrink-0 overflow-x-auto pb-1">
                        <div className="mx-auto flex w-max gap-2 px-1">
                          {items.map((image, index) => (
                            <motion.button
                              key={`lightbox-${image.id}`}
                              type="button"
                              onClick={() => goTo(index)}
                              whileHover={reducedMotion ? undefined : { y: -2 }}
                              whileTap={
                                reducedMotion ? undefined : { scale: 0.96 }
                              }
                              className={cn(
                                'relative size-16 shrink-0 overflow-hidden rounded-xl border bg-black/25 transition sm:size-20',
                                index === safeIndex
                                  ? 'border-white ring-2 ring-white/30'
                                  : 'border-white/20 hover:border-white/60',
                              )}
                              aria-label={`نمایش تصویر ${index + 1}`}
                              aria-current={index === safeIndex}
                            >
                              {image.url ? (
                                <Image
                                  src={image.url}
                                  alt={image.alt ?? productName}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              ) : (
                                <ProductImagePlaceholder
                                  compact
                                  label="بدون تصویر"
                                />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
