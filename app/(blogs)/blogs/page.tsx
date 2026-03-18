"use client";

import React, { useState, useEffect, useMemo } from "react";
import { BlogCardHorizontal } from "@/components/blog/BlogCardHorizontal";

type BlogListItem = {
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
};

export default function TagsPage() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (response.ok) {
          const data: unknown = await response.json();
          const arr = Array.isArray(data) ? data : [];
          const normalized: BlogListItem[] = arr
            .map((raw) => {
              if (!raw || typeof raw !== "object") return null;
              const r = raw as Record<string, unknown>;
              const tags = Array.isArray(r.tags)
                ? r.tags.filter((t): t is string => typeof t === "string")
                : [];
              return {
                id: String(r.id ?? ""),
                title: String(r.title ?? ""),
                excerpt: String(r.excerpt ?? ""),
                date: String(r.date ?? ""),
                readTime: String(r.readTime ?? ""),
                views: Number(r.views ?? 0),
                comments: Number(r.comments ?? 0),
                imageUrl: String(r.imageUrl ?? ""),
                slug: String(r.slug ?? r.id ?? ""),
                tags,
              };
            })
            .filter((x): x is BlogListItem => x !== null);

          setBlogs(normalized);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const tags = useMemo(() => {
    // 提取所有标签并计算每个标签的使用次数
    const tagCounts: Record<string, number> = {};
    blogs.forEach((blog) => {
      blog.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      });
    });

    // 转换为数组并按标签名排序
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  }, [blogs]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredBlogs = useMemo(() => {
    let result = blogs;
    
    // 标签过滤
    if (selectedTags.length > 0) {
      result = result.filter((blog) =>
        selectedTags.every((tag) => blog.tags.includes(tag)),
      );
    }
    
    // 排序
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // 按标题字母排序
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return sortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      }
    });
    
    return result;
  }, [selectedTags, blogs, sortBy, sortOrder]);

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // 根据选中标签过滤博客（逻辑已通过 filteredBlogs 派生，不再需要额外 effect）

  return (
    <div className="w-full py-12">
      {/* 主内容区 - 两栏布局 */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧标签栏 */}
        <div className="lg:w-1/4">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              标签列表
            </h2>
            <div className="flex flex-col gap-2">
              {tags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  aria-label={`查看标签 ${tag} 的文章`}
                >
                  <span>{tag}</span>
                  <span
                    className={`text-xs rounded-full w-6 h-6 flex items-center justify-center ${
                      selectedTags.includes(tag)
                        ? "bg-primary-foreground text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="mt-6 w-full px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200"
              >
                清除选择
              </button>
            )}
          </div>
        </div>

        {/* 右侧博客卡片区 */}
        <div className="lg:w-3/4">
          {filteredBlogs.length > 0 ? (
            <>
              {/* 排序控件 */}
              <div className="flex items-center justify-between mb-6 bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSortBy(sortBy === 'date' ? 'title' : 'date')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${sortBy === 'date' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    {sortBy === 'date' ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        时间
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        字母
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${sortOrder === 'desc' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={`${sortOrder === 'asc' ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}`} />
                    </svg>
                    {sortOrder === 'asc' ? '正序' : '倒序'}
                  </button>
                </div>
              </div>
              <div className="space-y-6">
              {filteredBlogs.map((blog) => (
                <BlogCardHorizontal
                  key={blog.id}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  date={blog.date}
                  readTime={blog.readTime}
                  views={blog.views}
                  comments={blog.comments}
                  imageUrl={blog.imageUrl}
                  slug={blog.slug}
                  tags={blog.tags}
                />
              ))}
              </div>
            </>
          ) : (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-24 mb-4 bg-muted rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  未找到相关文章
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  没有找到与所选标签匹配的博客文章，请尝试选择其他标签组合。
                </p>
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  查看所有文章
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
