// src/app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'نووا استور',
    short_name: 'نووا',
    description: 'فروشگاه اینترنتی نووا استور',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f7f0e3',
    theme_color: '#17324d',
    lang: 'fa',
    dir: 'rtl',
    icons: [
      {
        src: '/icon-96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
