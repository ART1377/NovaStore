// src/app/robots.ts
import { siteConfig } from '@/lib/site';
import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/account/',
        '/cart',
        '/checkout',
        '/notifications',
        '/api/',
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
