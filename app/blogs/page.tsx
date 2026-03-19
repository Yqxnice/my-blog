"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BlogCardHorizontal } from "@/components/blog/BlogCardHorizontal";
import FloatingSidebar from "@/components/FloatingSidebar";

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

export default function BlogsListPage() {
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
    const tagCounts: Record<string, number> = {};
    blogs.forEach((blog) => {
      blog.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  }, [blogs]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredBlogs = useMemo(() => {
    let result = blogs;

    if (selectedTags.length > 0) {
      result = result.filter((blog) => selectedTags.every((tag) => blog.tags.includes(tag)));
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return sortOrder === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      }
    });

    return result;
  }, [selectedTags, blogs, sortBy, sortOrder]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  return (
    <div className="w-full py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 text-foreground">标签列表</h2>
            <div className="flex flex-col gap-2">
              {tags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                    selectedTags.includes(tag) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
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

        <div className="lg:w-3/4">
          {filteredBlogs.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6 bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSortBy(sortBy === "date" ? "title" : "date")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      sortBy === "date" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {sortBy === "date" ? "时间" : "字母"}
                  </button>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      sortOrder === "desc" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {sortOrder === "asc" ? "正序" : "倒序"}
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
                <h3 className="text-xl font-semibold mb-2 text-foreground">未找到相关文章</h3>
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
      <FloatingSidebar />
    </div>
  );
}

