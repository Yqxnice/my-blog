import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Umami from "@/components/analytics/Umami";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: "%s - " + siteConfig.name
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.url
    }
  ],
  icons: {
    icon: siteConfig.favicon,
    apple: siteConfig.favicon
  },
  openGraph: {
    type: "website",
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.url + siteConfig.ogImage,
        width: 800,
        height: 800,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.url + siteConfig.ogImage]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: siteConfig.themeColor
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* 深色模式预加载脚本，避免闪烁 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // 检查 localStorage 中的深色模式设置
            const savedDarkMode = localStorage.getItem('darkMode');
            if (savedDarkMode === 'true' || (!savedDarkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          `
        }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        {/* RSS 订阅链接 */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="木子博客 RSS 订阅"
          href="/feed.xml"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            html {
              transition: background-color 0.3s ease, color 0.3s ease;
            }
            html *, html *::before, html *::after {
              transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }
          `
        }} />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <SpeedInsights />
          <Umami />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
