// src/lib/site.ts
export const siteConfig = {
  name: 'نووا استور',
  description: 'فروشگاه اینترنتی مدرن با تجربه خرید ساده، شفاف و سریع.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'fa_IR',
} as const;
