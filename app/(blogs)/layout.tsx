import type { Metadata } from "next";
import {Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import { LoadingBar } from "@/components/blog/LoadingBar";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: { default: "木子的博客", template: "%s · 木子的博客" },
  description: "独立开发者 / 技术博主 / 开源爱好者的个人博客",
  openGraph: {
    siteName: "木子的博客",
    locale: "zh_CN",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingBar />
      <Navbar />
      <main className="min-h-screen w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">{children}</main>
      <Footer />
    </>
  );
}
