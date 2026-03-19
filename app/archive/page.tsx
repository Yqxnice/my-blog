"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";

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

interface YearGroup {
  year: number;
  posts: BlogListItem[];
}


function EntryRow({ entry, visible }: { entry: BlogListItem; visible: boolean }) {
  return (
    <div className={`flex items-center py-4 border-b border-border/25 gap-6 transition-opacity duration-500 transition-transform duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}>
      {/* Date */}
      <span className="min-w-[40px] text-sm text-muted-foreground font-mono tracking-wider flex-shrink-0">
        {new Date(entry.date).toISOString().slice(5, 10).replace('-', '/')}
      </span>

      {/* Title */}
      <Link href={`/blogs/${entry.slug}`} className="flex-1">
        <span className="entry-title text-base text-foreground hover:text-primary transition-colors duration-200">
          {entry.title}
        </span>
      </Link>

      {/* Tags */}
      <span className="flex gap-2 flex-shrink-0">
        {entry.tags.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="text-xs text-muted-foreground">{t}</span>
            {i < entry.tags.length - 1 && (
              <span className="text-muted-foreground ml-2">/</span>
            )}
          </span>
        ))}
      </span>
    </div>
  );
}


function YearSection({ group }: { group: YearGroup }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="mb-14">
      {/* Year header */}
      <div className={`flex items-baseline gap-3 mb-2 pl-5 border-l-2 border-border/40 transition-opacity duration-600 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-3xl font-light text-foreground">{group.year}</h3>
        <span className="text-xs text-muted-foreground font-mono">{group.posts.length} entries</span>
      </div>

      {/* Entries */}
      <div className="pl-5">
        {group.posts.map((entry, i) => (
          <div key={entry.id} className="transition-all duration-500" style={{ transitionDelay: `${i * 0.07}s` }}>
            <EntryRow entry={entry} visible={visible} />
          </div>
        ))}
      </div>
    </div>
  );
}


function StatItem({ value, label, accent = false }: { value: string | number; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className={`text-2xl font-${accent ? 'semibold' : 'normal'} ${accent ? 'text-primary' : 'text-foreground'}`}>
        {value}
        {!accent && (
          <span className="text-sm text-muted-foreground ml-1">%</span>
        )}
      </span>
      <span className="text-xs text-muted-foreground tracking-wider">{label}</span>
    </div>
  );
}

export default function ArchivePage() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

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

  const archiveData = useMemo(() => {
    const grouped: Record<string, BlogListItem[]> = {};

    blogs.forEach((blog) => {
      const date = new Date(blog.date);
      const year = date.getFullYear().toString();

      if (!grouped[year]) {
        grouped[year] = [];
      }

      grouped[year].push(blog);
    });

    return Object.entries(grouped)
      .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
      .map(([year, posts]) => ({
        year: parseInt(year),
        posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }));
  }, [blogs]);

  const getCurrentDateInfo = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const totalDaysInYear = new Date(now.getFullYear(), 11, 31).getDate() + 334; // Approximation
    const yearProgress = Math.round((dayOfYear / totalDaysInYear) * 100);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayProgress = Math.round(((now.getTime() - startOfDay.getTime()) / (1000 * 60 * 60 * 24)) * 100);

    return {
      dayOfYear,
      yearProgress,
      dayProgress
    };
  }, []);

  return (
    <div className="w-full py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* ── Header ── */}
        <div className={`mb-16 transition-opacity duration-800 transition-transform duration-800 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {/* Label */}
          <p className="text-sm text-muted-foreground tracking-widest mb-2">时间线</p>

          {/* Count */}
          <div className="flex items-baseline gap-2 mb-7">
            <h1 className="text-6xl font-light text-foreground">{blogs.length}</h1>
            <span className="text-muted-foreground">篇，再接再厉</span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-9 mb-5">
            <StatItem value={getCurrentDateInfo.dayOfYear} label="今年第几天" accent />
            <StatItem value={getCurrentDateInfo.yearProgress} label="年度进度" />
            <StatItem value={getCurrentDateInfo.dayProgress} label="今日进度" />
          </div>

          {/* Motto */}
          <p className="text-sm text-muted-foreground tracking-wide">活在当下，珍惜眼下</p>
        </div>

        {/* ── Timeline ── */}
        {archiveData.length > 0 ? (
          archiveData.map((group) => (
            <YearSection key={group.year} group={group} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">暂无文章</h3>
            <p className="text-muted-foreground">
              还没有发布任何博客文章。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}