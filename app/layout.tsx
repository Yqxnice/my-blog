import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/lib/config";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Umami from "@/components/analytics/Umami";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import { LoadingBar } from "@/components/blog/LoadingBar";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 深色模式初始化脚本，避免页面闪烁
              if (typeof window !== 'undefined') {
                const savedDarkMode = window.localStorage.getItem('darkMode');
                let enabled = false;
                
                if (savedDarkMode === 'true') {
                  enabled = true;
                } else if (savedDarkMode === 'false') {
                  enabled = false;
                } else {
                  // 没有显式设置时，根据系统偏好决定
                  enabled = window.matchMedia &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
                }
                
                if (enabled) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              }
            `
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
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
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <SpeedInsights />
          <Umami />
          <ServiceWorkerRegister />
        </Suspense>
        <LoadingBar />
        <Navbar />
        <main className="min-h-screen w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
