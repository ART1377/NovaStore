// src/app/layout.tsx
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { ThemeColorSync } from '@/components/layout/theme-color-sync';
import { CompareBar } from '@/features/compare/components/compare-bar';
import { siteConfig } from '@/lib/site';
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY, themes } from '@/lib/themes';
import { AppProviders } from '@/providers/app-providers';
import type { Metadata, Viewport } from 'next';
import './globals.css';

const themeBootstrapScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var ok=${JSON.stringify(themes.map((theme) => theme.id))}.indexOf(t)>=0;document.documentElement.dataset.theme=ok?t:${JSON.stringify(
  DEFAULT_THEME_ID,
)};}catch(e){document.documentElement.dataset.theme=${JSON.stringify(
  DEFAULT_THEME_ID,
)};}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: 'Next.js',
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'shopping',
  formatDetection: { telephone: false },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-96.png', type: 'image/png', sizes: '96x96' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: '/icon-512.png', width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/icon-512.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#17324d',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <AppProviders>
          <ThemeColorSync />
          <Header />
          <div className="flex-1">{children}</div>
          <CompareBar />
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
