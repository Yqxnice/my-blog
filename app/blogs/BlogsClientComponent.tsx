/**
 * 功能：博客列表客户端组件
 * 目的：处理博客列表的客户端渲染和分页功能
 * 作者：Yqxnice
 */
"use client";

import { useState } from "react";
import Link from "next/link";

export type BlogListItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  imageUrl: string;
  slug: string;
  tags: string[];
  status: string;
};

interface BlogsClientComponentProps {
  posts: BlogListItem[];
}

export default function BlogsClientComponent({ posts }: BlogsClientComponentProps) {
  // 分页配置
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 计算分页数据
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <>
      {/* 文章列表 */}
      <div className="divide-y divide-border/70 border-t border-border/70">
        {currentPosts.map((post, index) => {
          const globalIndex = indexOfFirstPost + index + 1;
          const dateObj = new Date(post.date);
          const isNarrow = false; // 交由 CSS 控制排版，不在 JS 中判断

          return (
            <article
              key={post.id}
              id={post.tags?.[0] ? post.tags[0] : undefined}
              className="group">
              <Link
                href={`/blogs/${post.slug}`}
                aria-label={`博客：${post.title}`}
                className="flex flex-col gap-3 py-4 px-2 md:px-3 lg:px-4 hover:bg-secondary/70 rounded-xl transition-colors duration-200 md:flex-row md:items-start md:gap-4"
              >
                {/* 左侧序号 / 日期 */}
                <div className="flex items-center md:items-start gap-2 md:flex-col md:min-w-[3rem]">
                  <span className="font-serif text-xs text-muted-foreground w-8 text-left md:text-right md:w-full">
                    {String(globalIndex).padStart(2, "0")}
                  </span>
                  <time
                    className="hidden text-[11px] text-muted-foreground/80 md:inline-block"
                    dateTime={post.date}
                  >
                    {dateObj.toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </time>
                </div>

                {/* 中间标题 + 摘要 + 标签 */}
                <div className="flex-1 min-w-0 space-y-2">
                  <h2 className="text-lg md:text-xl font-semibold font-serif leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-[11px] text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 右侧元信息 */}
                <div className="flex flex-row md:flex-col items-center md:items-end gap-2 flex-shrink-0 text-xs text-muted-foreground md:pt-1">
                  <time
                    className="md:hidden text-[11px] text-muted-foreground/80"
                    dateTime={post.date}
                  >
                    {dateObj.toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </time>
                  <div className="flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* 分页组件 */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full bg-card px-1 py-1 shadow-sm border border-border/70">
            {/* 上一页按钮 */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-full text-[11px] md:text-xs text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              aria-label="上一页"
            >
              <span className="hidden md:inline">上一页</span>
              <span className="md:hidden">←</span>
            </button>

            {/* 页码按钮 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 md:px-3 py-1.5 rounded-full text-[11px] md:text-xs transition-colors ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {page}
              </button>
            ))}

            {/* 下一页按钮 */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-full text-[11px] md:text-xs text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              aria-label="下一页"
            >
              <span className="md:hidden">→</span>
              <span className="hidden md:inline">下一页</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
