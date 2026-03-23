/**
 * 功能：手记页面
 * 目的：展示手记列表
 * 作者：Yqxnice
 */
import { getAllNotes } from "@/lib/md-utils.server";
import NotesServerComponent from "@/components/notes/NotesServerComponent";
import NotesClientWrapper from "./NotesClientWrapper";
import { getPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = getPageMetadata('notes');

export default function NotesPage() {
  // 获取所有笔记并提取标签
  const notes = getAllNotes();
  const noteTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  return (
    <>
      <NotesServerComponent />
      <NotesClientWrapper tags={noteTags} />
    </>
  );
}
