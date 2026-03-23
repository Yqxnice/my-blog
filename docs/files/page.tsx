import NotesServerComponent from "./NotesServerComponent";
import { getPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = getPageMetadata('notes');

export default function NotesPage() {
  return <NotesServerComponent />;
}
