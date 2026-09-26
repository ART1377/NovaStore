// src/app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'نووا استور',
    short_name: 'نووا',
    description: 'فروشگاه اینترنتی نووا استور',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f0e3',
    theme_color: '#17324d',
    lang: 'fa',
    dir: 'rtl',
  };
}
