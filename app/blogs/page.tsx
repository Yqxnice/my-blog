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

export const metadata: Metadata = getPageMetadata('blogs');

// 博客列表页面（服务器组件）
export default function BlogsPage() {
  const posts = getAllBlogPosts();
  
  // 按日期排序，最新的在前
  const sortedPosts = posts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 提取所有唯一标签
  const blogTags = Array.from(new Set(sortedPosts.flatMap(post => post.tags)));

  return (
    <div className="bg-background text-foreground">
      {/* 页面头部 */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 -z-10"></div>
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-tight">
            博客
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            记录技术、思考与生活的碎片，分享我的学习历程和成长故事。
          </p>
        </div>
      </header>

      {/* 博客列表 */}
      <main className="max-w-5xl mx-auto px-4">
        {/* 标签云 */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">热门标签</h2>
          <div className="flex flex-wrap gap-2">
            {blogTags
              .sort((a, b) => {
                // 按标签出现的频率排序
                const countA = sortedPosts.filter(post => post.tags.includes(a)).length;
                const countB = sortedPosts.filter(post => post.tags.includes(b)).length;
                return countB - countA;
              })
              .slice(0, 15)
              .map((tag) => {
                const count = sortedPosts.filter(post => post.tags.includes(tag)).length;
                return (
                  <a
                    key={tag}
                    href={`#${tag}`}
                    className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    {tag} ({count})
                  </a>
                );
              })}
          </div>
        </div>

        {/* 文章列表和分页 */}
        <BlogsClientComponent posts={sortedPosts} />

        {/* 空状态 */}
        {sortedPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
