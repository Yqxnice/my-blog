/**
 * 功能：归档页面布局
 * 目的：为归档页面提供布局结构
 * 作者：Yqxnice
 */
import { getPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = getPageMetadata('archive');

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}