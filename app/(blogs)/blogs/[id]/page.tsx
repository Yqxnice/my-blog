'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Eye, MessageSquare, ArrowLeft, List } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import MdxContent from '@/components/mdx/MdxContent';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

type BlogDetail = {
  id: string;
  title: string;
  excerpt?: string;
  date: string;
  imageUrl: string;
  tags: string[];
  mdxContent: string;
  readTime: string;
  views: number;
  comments: number;
  wordCount: number;
  aiInvolvement?: string;
};

export default function BlogDetailPage() {
  const router = useRouter();
  // 参数来自 useParams，请先解包再使用
  const params = useParams();
  const idRaw = params?.id;
  const id = Array.isArray(idRaw) ? idRaw[0] : (idRaw ?? '');
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [showToc, setShowToc] = useState(true);
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageViews, setPageViews] = useState<number>(0);

  // 从 API 获取博客详情
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blogs?id=${id}`);
        if (response.ok) {
          const raw: unknown = await response.json();
          if (raw && typeof raw === 'object') {
            const r = raw as Record<string, unknown>;
            const tags = Array.isArray(r.tags)
              ? r.tags.filter((t): t is string => typeof t === 'string')
              : [];
            const normalized: BlogDetail = {
              id: String(r.id ?? id),
              title: String(r.title ?? ''),
              excerpt: typeof r.excerpt === 'string' ? r.excerpt : undefined,
              date: String(r.date ?? ''),
              imageUrl: String(r.imageUrl ?? ''),
              tags,
              mdxContent: String(r.mdxContent ?? ''),
              readTime: String(r.readTime ?? ''),
              views: Number(r.views ?? 0),
              comments: Number(r.comments ?? 0),
              wordCount: Number(r.wordCount ?? 0),
              aiInvolvement: typeof r.aiInvolvement === 'string' ? r.aiInvolvement : undefined,
            };
            setBlog(normalized);
            
            // 获取文章访问量
            try {
              // 调用本地 API 路由获取页面访问量
              const response = await fetch(`/api/share?pathname=/blogs/${id}`);
              if (response.ok) {
                const result = await response.json();
                setPageViews(result.pageViews);
              } else {
                console.error('Error fetching page views from API:', response.status);
                // 如果 API 调用失败，使用 0 作为默认值
                setPageViews(0);
              }
            } catch (error) {
              console.error('Error fetching page views:', error);
              // 如果发生错误，使用 0 作为默认值
              setPageViews(0);
            }
          } else {
            setBlog(null);
          }
        } else {
          setBlog(null);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    } else {
      setBlog(null);
      setLoading(false);
    }
  }, [id]);

  const toc = useMemo(() => {
    if (!blog?.mdxContent) return [];
    const headings: TocItem[] = [];
    const lines = blog.mdxContent.split('\n');
    lines.forEach((line: string) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
        headings.push({ id, text, level });
      }
    });
    return headings;
  }, [blog?.mdxContent]);

  useEffect(() => {
    const handleScroll = () => {
      if (!blog) return;
      
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
  }, [blog]);

  // 博客数据已直接通过 blog 常量获取，无需在 effect 中设置

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            aria-label="返回"
          >
            <ArrowLeft size={18} className="mr-2" />
            返回
          </button>
        </div>
        <div className="text-center py-24">
          <h1 className="text-2xl font-semibold mb-4">加载中...</h1>
          <p className="text-muted-foreground">正在获取博客内容...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            aria-label="返回"
          >
            <ArrowLeft size={18} className="mr-2" />
            返回
          </button>
        </div>
        <div className="text-center py-24">
          <h1 className="text-2xl font-semibold mb-4">博客不存在</h1>
          <p className="text-muted-foreground">找不到指定的博客文章</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 阅读进度条 */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 transition-all duration-100"
        style={{ width: `${readingProgress}%` }}
      />
      
      {/* JSON-LD 结构化数据 */}
      {blog && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              'headline': blog.title,
              'description': blog.excerpt,
              'datePublished': blog.date,
              'image': blog.imageUrl,
              'author': {
                '@type': 'Person',
                'name': '木子'
              },
              'publisher': {
                '@type': 'Organization',
                'name': '木子博客',
                'logo': {
                  '@type': 'ImageObject',
                  'url': '/favicon.ico'
                }
              },
              'keywords': blog.tags.join(', '),
              'wordCount': blog.wordCount
            })
          }}
        />
      )}
      
      <div className="w-full py-12">
        {/* 返回按钮 */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            aria-label="返回"
          >
            <ArrowLeft size={18} className="mr-2" />
            返回
          </button>
        </div>

        {/* 博客标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">{blog.title}</h1>
          
          {/* 博客元数据 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              <span>{pageViews || blog.views} 浏览</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              <span>{blog.comments || 0} 评论</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{blog.wordCount} 字</span>
            </div>
            {blog.aiInvolvement && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI: {blog.aiInvolvement}</span>
              </div>
            )}
          </div>

          {/* 博客标签 */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {blog.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                  aria-label={`标签: ${tag}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 博客内容 - 左右布局 */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* 左栏：博客内容 */}
          <div className="flex-1">
            {/* 博客图片 */}
            {blog.imageUrl && (
              <div className="mb-8">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            )}

            {/* 博客摘要 */}
            {blog.excerpt && (
              <div className="mb-8 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-muted-foreground italic">{blog.excerpt}</p>
              </div>
            )}

            <div className="prose max-w-none">
              <MdxContent source={blog.mdxContent} />
            </div>
          </div>

          {/* 右栏：目录 */}
          {toc.length > 0 && (
            <div className={`lg:w-64 shrink-0 ${showToc ? 'block' : 'hidden lg:block'}`}>
              <div className="lg:sticky lg:top-24 bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <List size={18} className="text-muted-foreground" />
                  <h3 className="font-semibold text-sm">目录</h3>
                  <button
                    onClick={() => setShowToc(!showToc)}
                    className="lg:hidden ml-auto text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
                <nav className="space-y-1">
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToHeading(item.id)}
                      className={`block w-full text-left text-sm py-1 transition-colors ${
                        item.level === 1 ? 'font-medium' : ''
                      } ${
                        item.level === 2 ? 'pl-4' : ''
                      } ${
                        item.level === 3 ? 'pl-8' : ''
                      } ${
                        activeHeading === item.id
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>

        {/* 评论区 */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">评论 ({blog.comments})</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=User1"
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium mb-1">用户1</h3>
                <p className="text-muted-foreground text-sm mb-2">这是一篇非常好的文章，学到了很多东西！</p>
                <div className="text-xs text-muted-foreground">2024-03-02</div>
              </div>
            </div>
            <div className="flex gap-4">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=User2"
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium mb-1">用户2</h3>
                <p className="text-muted-foreground text-sm mb-2">感谢分享，期待更多这样的内容！</p>
                <div className="text-xs text-muted-foreground">2024-03-03</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
