// src/components/layout/theme-color-sync.tsx
'use client';
import { useEffect } from 'react';
import { THEME_CHANGE_EVENT } from '@/lib/themes';

export function ThemeColorSync() {
  useEffect(() => {
    const update = () => {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue('--nova-ink')
        .trim();
      if (!color) return;
      const meta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
      );
      if (meta) meta.content = color;
    };

    update();
    window.addEventListener(THEME_CHANGE_EVENT, update);

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, update);
      observer.disconnect();
    };
  }, []);

  return null;
}
