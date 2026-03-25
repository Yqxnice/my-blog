'use client';

import { useState, useEffect } from 'react';

// 博客统计（手动维护或接入 API）
const BLOG_START = new Date('2026-03-01');
const BLOG_STATS = { posts: 2, words: 503 };

// 计算博客运行天数
function getDaysRunning() {
  return Math.floor((Date.now() - BLOG_START.getTime()) / 86400000);
}

// 格式化字数
function fmtWords(n: number) {
  return n >= 10000 ? `${(n / 10000).toFixed(1)} 万字` : `${n} 字`;
}

// 博客统计行组件
export function StatsBar() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(getDaysRunning());
  }, []);

  // 显示计算后的天数或占位符
  const displayDays = days !== null ? days : '--';
  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 py-3 pb-6 flex items-center gap-4 md:gap-6 flex-wrap">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M2 3h12v10H2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M5 3V1M11 3V1M2 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <strong className="font-serif text-sm font-semibold text-muted-foreground">{BLOG_STATS.posts}</strong> 篇文章
      </div>
      <span className="text-muted-foreground user-select-none">·</span>
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        运行 <strong className="font-serif text-sm font-semibold text-muted-foreground">{displayDays}</strong> 天
      </div>
      <span className="text-muted-foreground user-select-none">·</span>
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        约 <strong className="font-serif text-sm font-semibold text-muted-foreground">{fmtWords(BLOG_STATS.words)}</strong>
      </div>
    </div>
  );
}
