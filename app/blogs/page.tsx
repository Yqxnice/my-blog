/**
 * 功能：博客列表页面
 * 目的：展示博客文章列表和标签云
 * 作者：Yqxnice
 */
import { getAllBlogPosts } from "@/lib/md-utils.server";
import BlogsClientComponent from "./BlogsClientComponent";
import BlogsClientWrapper from "./BlogsClientWrapper";
import { getPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = getPageMetadata("blogs");

// 博客列表页面（服务器组件）
export default function BlogsPage() {
  const posts = getAllBlogPosts();

  // 按日期排序，最新的在前
  const sortedPosts = posts
    .filter((post) => post.status === "published")
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  // 提取所有唯一标签
  const blogTags = Array.from(
    new Set(sortedPosts.flatMap((post) => post.tags))
  );

  return (
    <div className="bg-background text-foreground">
      {/* 页面头部 */}
      <header className="relative overflow-hidden ">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 -z-10" />
        <div className="max-w-3xl mx-auto px-4  space-y-3 md:space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <span className="w-3.5 h-[1.5px] bg-primary" />
            <span>BLOGS / 笔记与文章</span>
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight">
            博客
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            记录技术、思考与生活的碎片，分享我的学习历程和成长故事。
          </p>
          <p className="text-xs md:text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
            <span>共 {sortedPosts.length} 篇文章</span>
            {sortedPosts[0] && (
              <span>
                最近更新：
                {new Date(sortedPosts[0].date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
            )}
          </p>
        </div>
      </header>

      {/* 博客列表 */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">

        {/* 文章列表和分页 */}
        <BlogsClientComponent posts={sortedPosts} />

        {/* 空状态 */}
        {sortedPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">暂无文章</h3>
            <p className="text-muted-foreground">文章正在路上，敬请期待！</p>
          </div>
        )}
      </main>

      {/* 浮动侧边栏 */}
      <BlogsClientWrapper tags={blogTags} />
    </div>
  );
}
