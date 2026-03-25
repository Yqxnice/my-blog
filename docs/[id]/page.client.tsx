'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MdxContent from '@/components/common/mdx/MdxContent';
import BlogGiscus from '@/components/common/giscus/BlogGiscus';
import type { BlogPost } from '@/lib/md-utils.server';
import './blog-post.css';

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
    <div className="blog-post-wrapper w-full overflow-x-hidden">
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 transition-all duration-100"
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

      <div className="w-full">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-4 flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
            aria-label="返回"
          >
            <ArrowLeft size={18} className="mr-2" />
            返回
          </button>
          
          {/* 移动端目录按钮 */}
          {toc.length > 0 && (
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="sm:hidden flex items-center text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
              aria-label={tocOpen ? "关闭目录" : "打开目录"}
            >
              <span className="mr-2">📑</span>
              目录
            </button>
          )}
        </div>

        {/* 文章主体区域 */}
        <div className="page-body max-w-[1080px] mx-auto px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* 左：正文 */}
            <article className="flex-1">
              <div className="mb-6 sm:mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground max-w-full break-words overflow-hidden" style={{ animation: 'fadeUp 0.4s ease both' }}>{blog.title}</h1>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center" style={{ animation: 'fadeUp 0.4s ease 0.05s both' }}>
                    <span>📅</span>
                    <span className="ml-1">{blog.date}</span>
                  </div>
                  <div className="flex items-center" style={{ animation: 'fadeUp 0.4s ease 0.1s both' }}>
                    <span>⏱️</span>
                    <span className="ml-1">{blog.readTime}</span>
                  </div>
                  <div className="flex items-center" style={{ animation: 'fadeUp 0.4s ease 0.15s both' }}>
                    <span>👁️</span>
                    <span className="ml-1">{pageViews || blog.views} 浏览</span>
                  </div>
                  <div className="flex items-center" style={{ animation: 'fadeUp 0.4s ease 0.2s both' }}>
                    <span>💬</span>
                    <span className="ml-1">{blog.comments || 0} 评论</span>
                  </div>
                  <div className="flex items-center" style={{ animation: 'fadeUp 0.4s ease 0.25s both' }}>
                    <span>📝</span>
                    <span className="ml-1">{blog.wordCount} 字</span>
                  </div>
                  {blog.aiInvolvement && (
                    <div className="flex items-center" style={{ animation: 'fadeUp 0.4s ease 0.3s both' }}>
                      <span>🤖</span>
                      <span className="ml-1">AI {blog.aiInvolvement}</span>
                    </div>
                  )}
                </div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4">
                    {blog.tags.map((tag: string, index) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        aria-label={`标签: ${tag}`}
                        style={{ animation: `fadeUp 0.4s ease ${0.35 + index * 0.05}s both` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {blog.imageUrl && (
                <div className="mb-6 w-full">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full max-h-[200px] sm:max-h-[250px] md:max-h-[300px] object-cover rounded-lg border border-border"
                  />
                </div>
              )}

              {blog.excerpt && (
                <blockquote className="italic mb-8 sm:mb-8 px-4 sm:px-0 break-words">
                  {blog.excerpt}
                </blockquote>
              )}

              <div className="prose prose-sm sm:prose lg:prose-lg max-w-none break-words overflow-hidden">
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
                  <div className="sm:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setTocOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-xs bg-background p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">目录</h3>
                        <button
                          onClick={() => setTocOpen(false)}
                          className="text-muted-foreground hover:text-primary p-2 rounded-full hover:bg-secondary"
                          aria-label="关闭目录"
                        >
                          ✕
                        </button>
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
                                className="toc-link w-full text-left break-words"
                                onClick={() => scrollToHeading(item.id)}
                                aria-current={isActive ? 'location' : undefined}
                              >
                                {item.level === 2 && (
                                  <span className="toc-num">{String(sectionNum).padStart(2, '0')}</span>
                                )}
                                <span className="toc-text break-words">{item.text}</span>
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
        </div>

        {/* Giscus 评论系统 */}
        <div className="max-w-[1080px] mx-auto px-4 mt-8">
          <BlogGiscus />
        </div>
      </div>
    </div>
  );
}
