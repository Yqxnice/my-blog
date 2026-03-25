'use client';

import { useState, useEffect } from 'react';
import { StatsBar, FunZone } from "../home";
import { BlogHero } from "./BlogHero";
import { BlogSectionHeader } from "./BlogSectionHeader";
import { BlogList, type BlogListItem } from "./BlogList";

interface BlogsClientComponentProps {
  posts: BlogListItem[];
}

export function BlogsClientComponent({ posts }: BlogsClientComponentProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载延迟，实际项目中可以根据数据获取状态来设置
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hero区域 */}
      <BlogHero />

      {/* 博客统计行 */}
      <StatsBar />

      {/* FunZone */}
      <FunZone />

      <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8">
        {/* 最新文章 */}
        <BlogSectionHeader title="最新文章" viewAllLink="/blogs" viewAllText="全部文章" />

        {/* 博客列表 */}
        <BlogList posts={posts} loading={loading} />
      </div>
    </>
  );
}