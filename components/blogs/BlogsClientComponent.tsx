'use client';

import { StatsBar, FunZone, NowSection, Guestbook } from "../home";
import { BlogHero } from "./BlogHero";
import { BlogSectionHeader } from "./BlogSectionHeader";
import { BlogList, type BlogListItem } from "./BlogList";

// 动画和样式
const MarqueeStyle = () => (
  <style jsx global>{`
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(14px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-marquee:hover {
      animation-play-state: paused;
    }
  `}</style>
);

interface BlogsClientComponentProps {
  posts: BlogListItem[];
}

export function BlogsClientComponent({ posts }: BlogsClientComponentProps) {
  return (
    <>
      <MarqueeStyle />
      {/* Hero区域 */}
      <BlogHero />

      {/* 博客统计行 */}
      <StatsBar />

      {/* FunZone */}
      <FunZone />

      {/* 近况 */}
      <NowSection />

      <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8">
        {/* 最新文章 */}
        <BlogSectionHeader title="最新文章" viewAllLink="/blogs" viewAllText="全部文章" />

        {/* 博客列表 */}
        <BlogList posts={posts} />

        {/* 留言墙 */}
        <Guestbook />
      </div>
    </>
  );
}