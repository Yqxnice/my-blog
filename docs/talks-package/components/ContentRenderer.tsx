'use client';

import type { TalkContentItem } from '@/types/talks';
import { useState, useEffect, useCallback } from 'react';
import CodeBlock from './CodeBlock';

interface ContentRendererProps {
  content: TalkContentItem;
}

export function ContentRenderer({ content }: ContentRendererProps) {
  switch (content.type) {
    case 'text':
      return <TextContent content={content.content} />;
    case 'image':
      return <ImageContent content={content} />;
    case 'link':
      return <LinkContent content={content} />;
    case 'quote':
      return <QuoteContent content={content} />;
    case 'video':
      return <VideoContent content={content} />;
    default:
      return null;
  }
}

// ─── Text ────────────────────────────────────────────────────────────────────

function TextContent({ content }: { content: string }) {
  const hasCodeBlock = content.includes('```');

  if (hasCodeBlock) {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
      <div className="text-sm text-foreground/80 leading-relaxed space-y-2">
        {parts.map((part, i) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const inner = part.slice(3, -3);
            const nl = inner.indexOf('\n');
            const lang = nl > 0 ? inner.substring(0, nl).trim() : 'javascript';
            const code = nl > 0 ? inner.substring(nl + 1) : inner;
            return <CodeBlock key={i} code={code} language={lang} />;
          }
          return part ? (
            <p key={i} className="whitespace-pre-wrap">{part}</p>
          ) : null;
        })}
      </div>
    );
  }

  return (
    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
      {content}
    </p>
  );
}

// ─── Image + Lightbox ────────────────────────────────────────────────────────

function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
      style={{ animation: 'lightbox-in 0.2s ease-out' }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="关闭"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
        style={{ animation: 'lightbox-img-in 0.25s cubic-bezier(0.16,1,0.3,1)' }}
      />

      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/40 select-none z-10">
        点击空白处或按 Esc 关闭
      </p>

      <style>{`
        @keyframes lightbox-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lightbox-img-in {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function ImageContent({
  content,
}: {
  content: { url: string; alt?: string; caption?: string };
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const close = useCallback(() => setLightboxOpen(false), []);

  return (
    <>
      <figure className="my-3">
        <div
          className="relative overflow-hidden rounded-lg bg-muted/30 max-h-96 cursor-zoom-in"
          onClick={() => isLoaded && setLightboxOpen(true)}
        >
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          <img
            src={content.url}
            alt={content.alt || '图片'}
            className={`w-full h-auto max-h-96 object-contain rounded-lg transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
          {isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/10 rounded-lg">
              <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            </div>
          )}
        </div>
        {content.caption && (
          <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">
            {content.caption}
          </figcaption>
        )}
      </figure>

      {lightboxOpen && (
        <ImageLightbox src={content.url} alt={content.alt || '图片'} onClose={close} />
      )}
    </>
  );
}

// ─── Link ────────────────────────────────────────────────────────────────────

function LinkContent({
  content,
}: {
  content: { url: string; title?: string; description?: string; siteName?: string };
}) {
  const domain = (() => {
    try { return new URL(content.url).hostname.replace(/^www\./, ''); }
    catch { return content.url; }
  })();

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <a
      href={content.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block my-2 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <img
          src={faviconUrl}
          alt=""
          width={16}
          height={16}
          className="mt-0.5 flex-shrink-0 rounded-sm"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
            (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'block');
          }}
        />
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5"
          className="text-muted-foreground mt-0.5 flex-shrink-0 hidden"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15,3 21,3 21,9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <div className="flex-1 min-w-0">
          {content.title && (
            <h4 className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors">
              {content.title}
            </h4>
          )}
          {content.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{content.description}</p>
          )}
          <p className="text-xs text-muted-foreground/60 mt-1 truncate">
            {content.siteName || domain}
          </p>
        </div>
      </div>
    </a>
  );
}

// ─── Quote ───────────────────────────────────────────────────────────────────

function QuoteContent({
  content,
}: {
  content: { text: string; author?: string; source?: string };
}) {
  return (
    <blockquote className="my-3 pl-4 border-l-2 border-primary/20">
      <p className="text-sm text-foreground/70 italic leading-relaxed">{content.text}</p>
      {(content.author || content.source) && (
        <footer className="mt-2 text-xs text-muted-foreground">
          {content.author && <span>—— {content.author}</span>}
          {content.source && <span className="ml-1">，{content.source}</span>}
        </footer>
      )}
    </blockquote>
  );
}

// ─── Video ───────────────────────────────────────────────────────────────────

function VideoContent({ content }: { content: { url: string; title?: string } }) {
  return (
    <div className="my-3">
      <div className="aspect-video rounded-lg overflow-hidden bg-muted/30">
        <iframe
          src={content.url}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={content.title || '视频'}
        />
      </div>
      {content.title && (
        <p className="text-xs text-muted-foreground mt-2 text-center">{content.title}</p>
      )}
    </div>
  );
}
