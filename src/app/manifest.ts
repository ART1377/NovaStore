// src/app/manifest.ts
import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'نووا استور',
    short_name: 'نووا',
    description: 'فروشگاه اینترنتی نووا استور',
    start_url: '/',
    display: 'standalone',
    background_color: 'var(--nova-surface)',
    theme_color: 'var(--nova-ink)',
    lang: 'fa',
    dir: 'rtl',
  };
}
