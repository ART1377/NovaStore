// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AppProviders } from '@/providers/app-providers';
import { CompareBar } from '@/features/compare/components/compare-bar';
import { siteConfig } from '@/lib/site';

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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('novastore-theme');var ok=['classic','sunset','violet','teal','sage','meadow','slate','sapphire','berry','ink','lava'].indexOf(t)>=0;document.documentElement.dataset.theme=ok?t:'classic'}catch(e){document.documentElement.dataset.theme='classic'}})()`,
          }}
        />
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
