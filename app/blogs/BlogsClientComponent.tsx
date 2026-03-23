/**
 * 功能：博客列表客户端组件
 * 目的：处理博客列表的客户端渲染和分页功能
 * 作者：Yqxnice
 */
'use client';

import { useState, useEffect } from "react";
import FloatingSidebar from "@/components/common/FloatingSidebar";

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
      <div className="space-y-2">
        {currentPosts.map((post, index) => (
          <article key={post.id} className="group">
            <div className="p-3 rounded-lg hover:bg-secondary transition-colors duration-200">
              {/* 文章标题 */}
              <h2 className="text-xl md:text-2xl font-bold font-serif mb-2 group-hover:text-primary transition-colors">
                <a href={`/blogs/${post.slug}`}>{post.title}</a>
              </h2>

              {/* 文章摘要 */}
              {post.excerpt && (
                <p className="text-muted-foreground mb-3 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              {/* 文章元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {post.readTime}
                </span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {index < currentPosts.length - 1 && (
              <div className="mt-4 border-t border-border"></div>
            )}
          </article>
        ))}
      </div>

      {/* 分页组件 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-1">
            {/* 上一页按钮 */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-border rounded-md text-sm hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>

            {/* 页码按钮 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${currentPage === page ? 'bg-primary text-white' : 'border border-border hover:border-primary hover:text-primary'}`}
              >
                {page}
              </button>
            ))}

            {/* 下一页按钮 */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-border rounded-md text-sm hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}



    </>
  );
}
