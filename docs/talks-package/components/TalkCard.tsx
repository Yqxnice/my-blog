'use client';

import { useState, useEffect } from 'react';
import type { TalkItem } from '@/types/talks';
import { ContentRenderer } from './ContentRenderer';

interface TalkCardProps {
  talk: TalkItem;
  index: number;
}

const MOOD_EMOJI: Record<string, string> = {
  愉快: '😊', 思考: '💭', 好奇: '🤔',
  '疲惫但满足': '😌', 放松: '☕', 惬意: '🍃',
  期待: '✨', 分享: '🎁', 宁静: '🌙',
};

export function TalkCard({ talk, index }: TalkCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), Math.min(index * 80, 600));
    return () => clearTimeout(timer);
  }, [index]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const tags: string[] = talk.tags ?? [];

  return (
    <article
      className={`relative pl-8 pb-8 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-[3px] transition-colors ${
          talk.isPinned
            ? 'bg-primary border-primary'
            : 'bg-background border-muted-foreground/30'
        }`}
      />

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <time
          className="text-xs text-muted-foreground font-mono"
          dateTime={talk.createdAt}
        >
          {formatDate(talk.createdAt)}
        </time>
        {talk.mood && (
          <span className="text-xs text-muted-foreground">
            {MOOD_EMOJI[talk.mood] || ''} {talk.mood}
          </span>
        )}
        {talk.location && (
          <span className="text-xs text-muted-foreground">· {talk.location}</span>
        )}
      </div>

      {/* Title */}
      {talk.title && (
        <h3 className="text-base font-medium mb-2 text-foreground/90">{talk.title}</h3>
      )}

      {/* Content */}
      <div className="space-y-3">
        {talk.content.map((content) => (
          <ContentRenderer key={content.id} content={content} />
        ))}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] bg-muted/60 text-muted-foreground border border-border/60"
            >
              <span className="opacity-50">#</span>{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
