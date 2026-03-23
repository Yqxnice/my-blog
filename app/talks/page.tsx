/**
 * 功能：碎碎念页面
 * 目的：展示碎碎念内容，支持按心情和标签筛选
 * 作者：Yqxnice
 */
'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { TalkCard } from '@/components/talks/TalkCard';
import FloatingSidebar from '@/components/common/FloatingSidebar';
import type { TalksData, TalkItem } from '@/types/talks';

// ─── SWR fetcher ─────────────────────────────────────────────────────────────

const fetcher = async (url: string): Promise<TalksData> => {
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`请求失败 (${res.status})`);
    (err as any).status = res.status;
    throw err;
  }
  return res.json();
};

// ─── Mood emoji ───────────────────────────────────────────────────────────────

const MOOD_EMOJI: Record<string, string> = {
  愉快: '😊', 思考: '💭', 好奇: '🤔',
  '疲惫但满足': '😌', 放松: '☕', 惬意: '🍃',
  期待: '✨', 分享: '🎁', 宁静: '🌙',
};

function getYear(d: string) {
  return new Date(d).getFullYear();
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="relative pl-8 pb-8 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full bg-muted/60" />
      <div className="flex gap-2 mb-3">
        <div className="h-3 w-14 rounded bg-muted/60" />
        <div className="h-3 w-16 rounded bg-muted/40" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-muted/50" />
        <div className="h-3 w-4/5 rounded bg-muted/50" />
        <div className="h-3 w-2/3 rounded bg-muted/40" />
      </div>
    </div>
  );
}

function TalksSkeleton() {
  return (
    <div className="relative">
      <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
      {[0, 120, 240, 360, 480].map((d, i) => (
        <SkeletonCard key={i} delay={d} />
      ))}
    </div>
  );
}

// ─── Error UI ─────────────────────────────────────────────────────────────────

function ErrorView({ error, retry }: { error: Error; retry: () => void }) {
  const is404 = (error as any).status === 404;
  return (
    <div className="py-20 text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-destructive"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div>
        <h3 className="text-base font-medium mb-1">
          {is404 ? '找不到内容' : '加载失败了'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {is404
            ? '接口不存在，请检查路由配置。'
            : error.message || '网络好像出了点问题'}
        </p>
      </div>
      {!is404 && (
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm
            bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
          </svg>
          重新加载
        </button>
      )}
    </div>
  );
}



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TalksPage() {
  const { data, error, isLoading, mutate } = useSWR<TalksData>('/api/talks', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 3000,
  });

  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTalks = useMemo<TalkItem[]>(() => {
    if (!data) return [];
    return [...data.talks]
      .filter((t) => !t.isDraft)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [data]);

  const { moods, tags } = useMemo(() => {
    const moodSet = new Set<string>();
    const tagSet = new Set<string>();
    allTalks.forEach((t) => {
      if (t.mood) moodSet.add(t.mood);
      (t.tags ?? []).forEach((tag: string) => tagSet.add(tag));
    });
    return { moods: [...moodSet], tags: [...tagSet] };
  }, [allTalks]);

  const talks = useMemo(
    () => allTalks.filter((t) => {
      if (activeMood && t.mood !== activeMood) return false;
      if (activeTag && !(t.tags ?? []).includes(activeTag)) return false;
      return true;
    }),
    [allTalks, activeMood, activeTag],
  );

  const grouped = useMemo(() => {
    const map = new Map<number, TalkItem[]>();
    talks.forEach((t) => {
      const y = getYear(t.createdAt);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(t);
    });
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [talks]);

  const metadata = data?.metadata ?? { description: '' };
  let globalIndex = 0;

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 pb-16">
      {/* Header */}
      <header className="pb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-wide">碎碎念</h1>
        {isLoading ? (
          <div className="mt-4 h-3 w-48 rounded bg-muted/50 animate-pulse" />
        ) : (
          <p className="mt-4 text-muted-foreground text-sm">{metadata.description}</p>
        )}
      </header>

      {/* Error */}
      {error && <ErrorView error={error} retry={() => mutate()} />}

      {/* Skeleton */}
      {isLoading && <TalksSkeleton />}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {/* Timeline */}
          {grouped.length > 0 ? (
            <div className="relative">
              <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
              {grouped.map(([year, yearTalks]) => (
                <div key={year}>
                  <div className="relative flex items-center mb-6 pl-8">
                    <div className="absolute left-0 w-[15px] h-[15px] flex items-center justify-center">
                      <div className="w-2 h-2 bg-muted-foreground/30 rotate-45" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground/60 tracking-widest uppercase select-none">
                      {year}
                    </span>
                  </div>
                  <div className="space-y-0">
                    {yearTalks.map((talk) => {
                      const idx = globalIndex++;
                      return <TalkCard key={talk.id} talk={talk} index={idx} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                {activeMood || activeTag ? '没有符合条件的碎碎念' : '暂无碎碎念'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeMood || activeTag ? (
                  <button
                    onClick={() => { setActiveMood(null); setActiveTag(null); }}
                    className="text-primary hover:underline"
                  >
                    清除筛选试试看？
                  </button>
                ) : '生活的小确幸正在路上'}
              </p>
            </div>
          )}
        </>
      )}

      <FloatingSidebar 
        tags={tags} 
        moods={moods} 
        moodEmojis={MOOD_EMOJI}
        activeTag={activeTag}
        activeMood={activeMood}
        page="talks" 
        onTagClick={(tag) => setActiveTag(activeTag === tag ? null : tag)}
        onMoodClick={(mood) => setActiveMood(activeMood === mood ? null : mood)}
        onClearFilters={() => { setActiveMood(null); setActiveTag(null); }}
      />
    </div>
  );
}
