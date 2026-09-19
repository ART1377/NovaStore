// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AppProviders } from '@/providers/app-providers';
import { CompareBar } from '@/features/compare/components/compare-bar';
import { siteConfig } from '@/lib/site';
import { themes, THEME_STORAGE_KEY, DEFAULT_THEME_ID } from '@/lib/themes';

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
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: 'var(--nova-ink)',
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
          <Header />
          <div className="flex-1">{children}</div>
          <CompareBar />
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
