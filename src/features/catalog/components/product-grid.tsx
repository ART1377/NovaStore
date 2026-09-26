// src/features/catalog/components/product-grid.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useSyncExternalStore } from 'react';
import type { Product } from '../types/catalog-types';
import { ProductCard } from './product-card';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ProductGrid({
  products,
  animated = false,
}: {
  products: Product[];
  animated?: boolean;
}) {
  const reducedMotion = useReducedMotion() === true;
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => {
        if (!animated) {
          return <ProductCard key={product.id} product={product} />;
        }

        const delay = Math.min(index * 0.055, 0.42);
        const hidden = { opacity: 0, y: 28, scale: 0.965 };
        const visible = {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: reducedMotion ? 0 : 0.62,
            delay: reducedMotion ? 0 : delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

        return (
          <motion.div
            key={product.id}
            initial={hidden}
            animate={mounted ? visible : hidden}
            whileHover={reducedMotion ? undefined : { y: -7, scale: 1.012 }}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: 'easeOut' }}
            className="min-w-0"
          >
            <ProductCard product={product} />
          </motion.div>
        );
      })}
    </div>
  );
}
