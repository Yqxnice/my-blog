/**
 * 功能：网站主布局组件
 * 目的：提供网站的整体布局结构，包括导航栏、页脚等
 * 作者：Yqxnice
 */
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Umami from "@/components/common/analytics/Umami";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/footer/Footer";
import { LoadingBar } from "@/components/common/LoadingBar";
import { ServiceWorkerRegister } from "@/components/common/ServiceWorkerRegister";
import ErrorBoundaryWrapper from "@/components/common/ErrorBoundaryWrapper";

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
        <link
          rel="alternate"
          type="application/rss+xml"
          title="木子博客 RSS 订阅"
          href="/feed.xml"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="木子博客" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://api.dicebear.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <Suspense fallback={null}>
          <SpeedInsights />
          <Umami />
          <ServiceWorkerRegister />
        </Suspense>
        <LoadingBar />
        <Navbar />
        <ErrorBoundaryWrapper>
          <main className="min-h-screen w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
        </ErrorBoundaryWrapper>
        <Footer />
      </body>
    </html>
  );
}
