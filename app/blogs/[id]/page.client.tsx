'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MdxContent from '@/components/common/mdx/MdxContent';
import CommentSection from '@/components/common/comments/CommentSection';
import type { BlogPost } from '@/lib/md-utils.server';

// TOC 样式
const TocStyles = () => (
  <style jsx global>{`
    /* ── Right TOC ── */
    .right-toc {
      position: sticky;
      top: 24px;
      max-height: calc(100vh - 48px);
      overflow-y: auto;
      scrollbar-width: none;
    }
    .right-toc::-webkit-scrollbar { display: none; }

    .toc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: .9rem;
      padding-bottom: .7rem;
      border-bottom: 1px solid var(--border);
    }
    .toc-title-row { display: flex; align-items: center; gap: .5rem; }
    .toc-accent-bar {
      width: 3px; height: 14px;
      background: var(--accent, #c0392b);
      border-radius: 2px;
      flex-shrink: 0;
    }
    .toc-label {
      font-size: .68rem;
      font-weight: 500;
      color: var(--ink3, #8a8480);
      letter-spacing: .14em;
      text-transform: uppercase;
    }
    .toc-count {
      font-size: .62rem;
      color: var(--ink3, #8a8480);
      background: var(--tag-bg, #eeebe5);
      padding: .1rem .4rem;
      border-radius: 3px;
    }

    .toc-items { display: flex; flex-direction: column; }
    .toc-item { display: flex; align-items: stretch; position: relative; }
    .toc-track {
      width: 2px;
      background: var(--border, #e2ddd6);
      flex-shrink: 0;
      margin-right: .75rem;
      border-radius: 2px;
      transition: background .2s;
    }
    .toc-item.act .toc-track { background: var(--accent, #c0392b); }

    .toc-link {
      flex: 1;
      display: flex;
      align-items: baseline;
      gap: .45rem;
      padding: .32rem 0;
      font-size: .76rem;
      color: var(--ink3, #8a8480);
      line-height: 1.4;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: color .2s;
    }
    .toc-link:hover { color: var(--ink2, #4a4540); }
    .toc-item.act .toc-link { color: var(--ink, #1a1714); }

    .toc-num {
      font-size: .65rem;
      color: var(--border, #e2ddd6);
      flex-shrink: 0;
      min-width: 1.2rem;
      transition: color .2s;
    }
    .toc-item.act .toc-num { color: var(--accent, #c0392b); }
    .toc-text { line-height: 1.4; }

    .toc-item.depth-3 .toc-link { font-size: .71rem; padding-left: .8rem; }
    .toc-item.depth-3 .toc-num { display: none; }
    .toc-item.depth-4 .toc-link { font-size: .68rem; padding-left: 1.6rem; }
    .toc-item.depth-4 .toc-num { display: none; }

    .toc-empty { font-size: .76rem; color: var(--ink3, #8a8480); padding: .5rem 0; }
    .toc-divider { border: none; border-top: 1px solid var(--border, #e2ddd6); margin: 1.2rem 0; }

    /* 移动端目录 */
    .sm\:hidden .toc-items {
      display: flex;
      flex-direction: column;
    }
    .sm\:hidden .toc-item {
      display: flex;
      align-items: stretch;
      position: relative;
    }
    .sm\:hidden .toc-track {
      width: 2px;
      background: var(--border, #e2ddd6);
      flex-shrink: 0;
      margin-right: .75rem;
      border-radius: 2px;
      transition: background .2s;
    }
    .sm\:hidden .toc-item.act .toc-track {
      background: var(--accent, #c0392b);
    }
    .sm\:hidden .toc-link {
      flex: 1;
      display: flex;
      align-items: baseline;
      gap: .45rem;
      padding: .32rem 0;
      font-size: .76rem;
      color: var(--ink3, #8a8480);
      line-height: 1.4;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: color .2s;
    }
    .sm\:hidden .toc-link:hover {
      color: var(--ink2, #4a4540);
    }
    .sm\:hidden .toc-item.act .toc-link {
      color: var(--ink, #1a1714);
    }
    .sm\:hidden .toc-num {
      font-size: .65rem;
      color: var(--border, #e2ddd6);
      flex-shrink: 0;
      min-width: 1.2rem;
      transition: color .2s;
    }
    .sm\:hidden .toc-item.act .toc-num {
      color: var(--accent, #c0392b);
    }
    .sm\:hidden .toc-text {
      line-height: 1.4;
    }
    .sm\:hidden .toc-item.depth-3 .toc-link {
      font-size: .71rem;
      padding-left: .8rem;
    }
    .sm\:hidden .toc-item.depth-3 .toc-num {
      display: none;
    }
    .sm\:hidden .toc-item.depth-4 .toc-link {
      font-size: .68rem;
      padding-left: 1.6rem;
    }
    .sm\:hidden .toc-item.depth-4 .toc-num {
      display: none;
    }
  `}</style>
);

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface BlogDetailClientProps {
  blog: BlogPost;
  pageViews: number;
}

export default function BlogDetailClient({ blog, pageViews }: BlogDetailClientProps) {
  const router = useRouter();
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState<string>('');

  const toc = useMemo(() => {
    if (!blog.mdxContent) return [];
    const headings: TocItem[] = [];
    const lines = blog.mdxContent.split('\n');
    lines.forEach((line: string) => {
      const match = line.match(/^(#{1,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
        headings.push({ id, text, level });
      }
    });
    return headings;
  }, [blog.mdxContent]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);

      const headingElements = document.querySelectorAll('h1, h2, h3');
      let currentActive = '';
      headingElements.forEach((elem) => {
        const rect = elem.getBoundingClientRect();
        if (rect.top <= 100) {
          currentActive = elem.id;
        }
      });
      if (currentActive) {
        setActiveHeading(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [tocOpen, setTocOpen] = useState(false);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setTocOpen(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <TocStyles />
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 transition-all duration-100"
        style={{ width: `${readingProgress}%` }}
      />

      {/* 动态OG封面图 */}
      <meta
        property="og:image"
        content={`/api/og?title=${encodeURIComponent(blog.title)}`}
      />
      <meta
        property="twitter:image"
        content={`/api/og?title=${encodeURIComponent(blog.title)}`}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.excerpt,
            datePublished: blog.date,
            image: `/api/og?title=${encodeURIComponent(blog.title)}`,
            author: {
              '@type': 'Person',
              name: '木子',
            },
            publisher: {
              '@type': 'Organization',
              name: '木子博客',
              logo: {
                '@type': 'ImageObject',
                url: '/favicon.ico',
              },
            },
            keywords: blog.tags.join(', '),
            wordCount: blog.wordCount,
          }),
        }}
      />

      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* 返回按钮 - 仅桌面端显示 */}
        <div className="hidden sm:flex items-center mb-4 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
            aria-label="返回"
          >
            <ArrowLeft size={18} className="mr-2" />
            返回
          </button>
        </div>

        {/* 文章标题和元信息 */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground leading-snug sm:leading-tight text-center">
            {blog.title}
          </h1>

          {/* 移动端：紧凑的元信息布局 */}
          <div className="sm:hidden flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <span>📅</span>
              <span>{blog.date}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{blog.readTime}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>👁️</span>
              <span>{pageViews || blog.views}</span>
            </span>
            {blog.aiInvolvement && (
              <span className="flex items-center gap-1">
                <span>🤖</span>
                <span>AI {blog.aiInvolvement}</span>
              </span>
            )}
          </div>

          {/* 桌面端：完整的元信息布局 */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <span>📅</span>
              <span className="ml-1">{blog.date}</span>
            </div>
            <div className="flex items-center">
              <span>⏱️</span>
              <span className="ml-1">{blog.readTime}</span>
            </div>
            <div className="flex items-center">
              <span>👁️</span>
              <span className="ml-1">{pageViews || blog.views} 浏览</span>
            </div>
            <div className="flex items-center">
              <span>💬</span>
              <span className="ml-1">{blog.comments || 0} 评论</span>
            </div>
            <div className="flex items-center">
              <span>📝</span>
              <span className="ml-1">{blog.wordCount} 字</span>
            </div>
            {blog.aiInvolvement && (
              <div className="flex items-center">
                <span>🤖</span>
                <span className="ml-1">AI {blog.aiInvolvement}</span>
              </div>
            )}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 justify-center">
              {blog.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 sm:px-3 py-0.5 sm:py-1 bg-secondary rounded-full text-xs text-muted-foreground hover:bg-secondary/80 transition-colors border border-border/50"
                  aria-label={`标签: ${tag}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 文章主体区域 */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* 左：正文 */}
          <article className="flex-1 min-w-0">
            {blog.imageUrl && (
              <div className="mb-6 sm:mb-8 w-full -mx-3 sm:mx-0 px-3 sm:px-0">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-auto max-h-64 sm:max-h-80 object-cover rounded-none sm:rounded-lg border-0 sm:border border-border"
                />
              </div>
            )}

            {blog.excerpt && (
              <blockquote className="italic mb-6 sm:mb-8 px-3 sm:px-4 py-2.5 sm:py-3 bg-muted rounded-lg border-l-4 border-primary text-sm sm:text-base">
                {blog.excerpt}
              </blockquote>
            )}

            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
              <MdxContent source={blog.mdxContent} />
            </div>
          </article>

          {/* 右：目录 */}
          {toc.length > 0 && (
            <>
              {/* 桌面端目录 */}
              <aside className="right-toc hidden sm:block w-64 flex-shrink-0">
                <div className="toc-header">
                  <div className="toc-title-row">
                    <div className="toc-accent-bar" aria-hidden />
                    <span className="toc-label">目录</span>
                  </div>
                  <span className="toc-count">{toc.length} 节</span>
                </div>

                <div className="toc-items" role="list">
                  {toc.map((item, idx) => {
                    const isActive = activeHeading === item.id;
                    const sectionNum = idx + 1;
                    return (
                      <div
                        key={item.id}
                        className={[
                          'toc-item',
                          item.level === 3 ? 'depth-3' : '',
                          item.level === 4 ? 'depth-4' : '',
                          isActive ? 'act' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        role="listitem"
                      >
                        <div className="toc-track" aria-hidden />
                        <button
                          className="toc-link"
                          onClick={() => scrollToHeading(item.id)}
                          aria-current={isActive ? 'location' : undefined}
                        >
                          {item.level === 2 && (
                            <span className="toc-num">{String(sectionNum).padStart(2, '0')}</span>
                          )}
                          <span className="toc-text">{item.text}</span>
                        </button>
                      </div>
                    )}
                  )}
                </div>
              </aside>

              {/* 移动端目录 */}
              {tocOpen && (
                <div className="sm:hidden fixed inset-0 bg-black/60 z-50" onClick={() => setTocOpen(false)}>
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-background shadow-2xl overflow-hidden flex flex-col" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* 移动端目录头部 */}
                    <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-primary rounded-full" />
                        <h3 className="font-semibold text-base">目录</h3>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                          {toc.length} 节
                        </span>
                      </div>
                      <button
                        onClick={() => setTocOpen(false)}
                        className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-secondary transition-colors"
                        aria-label="关闭目录"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    
                    {/* 移动端目录内容 */}
                    <div className="flex-1 overflow-y-auto p-4 toc-items" role="list">
                      {toc.map((item, idx) => {
                        const isActive = activeHeading === item.id;
                        const sectionNum = idx + 1;
                        return (
                          <div
                            key={item.id}
                            className={[
                              'toc-item',
                              item.level === 3 ? 'depth-3' : '',
                              item.level === 4 ? 'depth-4' : '',
                              isActive ? 'act' : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            role="listitem"
                          >
                            <div className="toc-track" aria-hidden />
                            <button
                              className="toc-link w-full text-left break-words py-2.5"
                              onClick={() => scrollToHeading(item.id)}
                              aria-current={isActive ? 'location' : undefined}
                            >
                              {item.level === 2 && (
                                <span className="toc-num">{String(sectionNum).padStart(2, '0')}</span>
                              )}
                              <span className="toc-text break-words text-sm">{item.text}</span>
                            </button>
                          </div>
                        )}
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 评论系统 */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
          <CommentSection postId={blog.id} />
        </div>
      </div>
    </div>
  );
}
