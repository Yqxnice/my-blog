/**
 * 功能：手记页面客户端包装器
 * 目的：处理客户端逻辑，包括标签筛选和浮动侧边栏
 * 作者：Yqxnice
 */
'use client';

import { useState } from "react";
import FloatingSidebar from "@/components/common/FloatingSidebar";

interface NotesClientWrapperProps {
  tags: string[];
}

export default function NotesClientWrapper({ tags }: NotesClientWrapperProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <FloatingSidebar 
      tags={tags} 
      activeTag={activeTag}
      page="notes" 
      onTagClick={(tag) => setActiveTag(activeTag === tag ? null : tag)}
      onClearFilters={() => setActiveTag(null)}
    />
  );
}