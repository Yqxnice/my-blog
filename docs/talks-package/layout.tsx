import { getPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = getPageMetadata('talks');

export default function TalksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
