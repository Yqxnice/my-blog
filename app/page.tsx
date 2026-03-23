/**
 * 功能：网站首页
 * 目的：展示博客文章列表
 * 作者：Yqxnice
 */
import { BlogsServerComponent } from "@/components/blogs/BlogsServerComponent";
import { getPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = getPageMetadata('home');

export default function HomePage() {
  return <BlogsServerComponent />;
}

