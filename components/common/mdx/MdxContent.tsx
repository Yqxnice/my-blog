/**
 * 功能：MDX内容渲染组件
 * 目的：渲染MDX格式的内容，支持自定义组件和样式
 * 作者：Yqxnice
 */
'use client';

import React, { useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import pangu from 'pangu';
import Image from 'next/image';
import Link from 'next/link';
import CodeBlock from './CodeBlock';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { AlertTriangle, Info, CheckCircle, ExternalLink, Link as LinkIcon, MonitorPlay } from 'lucide-react';
import slugger from 'github-slugger';

interface MdxContentProps {
  source: string;
}

// 自定义 sanitize schema - 保留必要的样式和属性
const customSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // 允许特定的 class 名称
    '*': [
      ...(defaultSchema.attributes?.['*'] || []),
      'className',
      'class',
    ],
    // a 标签允许的属性
    a: [
      ...(defaultSchema.attributes?.a || []),
      'className',
      'class',
      'target',
      'rel',
    ],
    // img 标签允许的属性
    img: [
      ...(defaultSchema.attributes?.img || []),
      'className',
      'class',
      'loading',
      'width',
      'height',
    ],
    // code 标签允许的属性
    code: [
      ...(defaultSchema.attributes?.code || []),
      'className',
      'class',
    ],
    // table 相关标签允许的属性
    table: [
      ...(defaultSchema.attributes?.table || []),
      'className',
      'class',
    ],
    th: [
      ...(defaultSchema.attributes?.th || []),
      'className',
      'class',
    ],
    td: [
      ...(defaultSchema.attributes?.td || []),
      'className',
      'class',
    ],
  },
  tagNames: defaultSchema.tagNames,
};

// 生成唯一的ID
const generateId = (text: string) => {
  const slug = new slugger();
  return slug.slug(text);
};

const CustomLink = ({ href, children, ...props }: any) => {
  const hrefString = href || '';
  const isInternal = hrefString.startsWith('/') || hrefString.startsWith('#');
  // 判断是否是纯 URL 文本（通常意味着你单独贴了一个链接，用来触发书签卡片）
  const isStandaloneUrl = typeof children === 'string' && children === hrefString;

  // ==========================================
  // 1 & 4. 内部链接 (Next.js Link + 悬浮预览)
  // ==========================================
  if (isInternal) {
    // 针对博客文章链接，加上类似维基百科的 HoverCard 预览
    if (hrefString.startsWith('/blogs/')) {
      return (
        /* 如果你没有安装 shadcn HoverCard，可以将 HoverCard 这一层去掉，只保留内部的 Link */
        // <HoverCard>
        //  <HoverCardTrigger asChild>
            <Link 
              href={hrefString} 
              className="text-primary hover:text-primary/80 font-semibold underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all"
            >
              {children}
            </Link>
        //  </HoverCardTrigger>
        //  <HoverCardContent className="w-80 p-4 shadow-xl rounded-xl border-border bg-card z-50">
        //    <div className="space-y-2">
        //      <h4 className="text-sm font-bold text-foreground">文章预览</h4>
        //      <p className="text-sm text-muted-foreground line-clamp-2">
        //        点击探索关于《{children}》的完整内容。
        //        {/* 进阶：这里可以结合 SWR 或 fetch 动态拉取文章摘要 */}
        //      </p>
        //    </div>
        //  </HoverCardContent>
        // </HoverCard>
      );
    }
    
    // 普通内部链接 (如 #锚点 或 /about)
    return (
      <Link href={hrefString} className="text-primary hover:underline font-medium">
        {children}
      </Link>
    );
  }

  // ==========================================
  // 3. 极客专属：链接自动转换内嵌小部件 (Auto-Embeds)
  // ==========================================
  // Bilibili 视频识别
  const bilibiliMatch = hrefString.match(/bilibili\.com\/video\/(BV\w+)/);
  if (bilibiliMatch) {
    return (
      <span className="block my-6 w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-border bg-muted">
        <span className="block bg-secondary px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground border-b border-border">
          <MonitorPlay size={14} /> Bilibili Video Embedded
        </span>
        <span className="block aspect-video w-full">
          <iframe 
            src={`//player.bilibili.com/player.html?bvid=${bilibiliMatch[1]}&page=1&high_quality=1&danmaku=0`} 
            scrolling="no" frameBorder="no" allowFullScreen={true} className="w-full h-full"
          />
        </span>
      </span>
    );
  }


  
  // 图片链接识别（避免将图片链接转换为书签卡片）
  const imageMatch = hrefString.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
  if (imageMatch) {
    return (
      <a 
        href={hrefString} 
        className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200 font-medium inline-flex items-center gap-0.5" 
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        {children}
        <ExternalLink size={12} className="inline-block opacity-60 relative -top-0.5" />
      </a>
    );
  }

  // ==========================================
  // 2. Notion 风格书签卡片 (Bookmark Cards)
  // ==========================================
  // 如果你在 Markdown 里单贴了一个网址（没有加上文字描述），自动膨胀为卡片
  if (isStandaloneUrl) {
    let domain = '';
    let faviconUrl = '';
    let siteName = '';
    let isValidUrl = false;
    
    try {
      // 提取域名，用于显示网站 logo
      const url = new URL(hrefString);
      domain = url.hostname;
      faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
      
      // 提取网站名称（从域名中）
      siteName = domain.replace(/^www\./, '').split('.')[0];
      isValidUrl = true;
    } catch {
      // 如果 URL 解析失败，显示为普通链接
      return (
        <a 
          href={hrefString} 
          className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200 font-medium inline-flex items-center gap-0.5" 
          target="_blank" 
          rel="noopener noreferrer"
          {...props}
        >
          {children}
          <ExternalLink size={12} className="inline-block opacity-60 relative -top-0.5" />
        </a>
      );
    }
    
    if (isValidUrl) {
      return (
        <span className="block my-6 flex justify-center">
          <a 
            href={hrefString} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block group no-underline w-full max-w-2xl"
          >
            <span className="flex flex-col sm:flex-row items-center border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/50 transition-all duration-200 bg-card p-4">
              {/* 网站 logo */}
              <span className="flex-shrink-0 mr-4 mb-3 sm:mb-0">
                <img 
                  src={faviconUrl} 
                  alt={`${siteName} logo`} 
                  className="w-10 h-10 rounded-lg object-cover"
                />
              </span>
              
              <span className="flex-1 min-w-0">
                <span className="block text-base font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                  {siteName.charAt(0).toUpperCase() + siteName.slice(1)}
                </span>
                <span className="block text-sm text-muted-foreground mb-2 truncate">
                  {hrefString}
                </span>
              </span>
              
              {/* 右侧箭头图标 */}
              <span className="flex-shrink-0 ml-4 text-muted-foreground group-hover:text-primary transition-colors">
                <ExternalLink size={20} />
              </span>
            </span>
          </a>
        </span>
      );
    }
  }

  // ==========================================
  // 默认：常规的外部链接
  // ==========================================
  return (
    <a 
      href={hrefString} 
      className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200 font-medium inline-flex items-center gap-0.5" 
      target="_blank" 
      rel="noopener noreferrer"
      {...props}
    >
      {children}
      <ExternalLink size={12} className="inline-block opacity-60 relative -top-0.5" />
    </a>
  );
};

const MdxContent: React.FC<MdxContentProps> = ({ source }) => {
  // 使用useMemo优化组件配置，避免每次渲染都重新创建
  const components = useMemo<Components>(() => ({
    h1: ({ children }) => {
      // 文章标题已在页面顶部显示，将h1转换为h2
      const text = String(children);
      const id = generateId(text);
      return <h2 id={id} className="text-xl sm:text-2xl font-semibold mt-8 mb-4 scroll-mt-24">{children}</h2>;
    },
    h2: ({ children }) => {
      const text = String(children);
      const id = generateId(text);
      return <h2 id={id} className="text-xl sm:text-2xl font-semibold mt-6 mb-3 scroll-mt-24">{children}</h2>;
    },
    h3: ({ children }) => {
      const text = String(children);
      const id = generateId(text);
      return <h3 id={id} className="text-lg sm:text-xl font-medium mt-4 mb-2 scroll-mt-24">{children}</h3>;
    },
    h4: ({ children }) => {
      const text = String(children);
      const id = generateId(text);
      return <h4 id={id} className="text-base sm:text-lg font-medium mt-3 mb-2 scroll-mt-24">{children}</h4>;
    },
    p: ({ children }) => {
      return <p className="mb-4 leading-relaxed text-sm sm:text-base">{children}</p>;
    },
    ul: ({ children }) => {
      return <ul className="mb-4 ml-6 list-disc space-y-2 text-sm sm:text-base">{children}</ul>;
    },
    ol: ({ children }) => {
      return <ol className="mb-4 ml-6 list-decimal space-y-2 text-sm sm:text-base">{children}</ol>;
    },
    li: ({ children }) => {
      return <li className="leading-relaxed">{children}</li>;
    },
    blockquote: ({ children }) => {
          // 将 children 转换为文本以检查是否包含特定标记
          const text = String(children);
          const isWarning = text.includes('[!WARNING]');
          const isNote = text.includes('[!NOTE]');
          const isSuccess = text.includes('[!SUCCESS]');

          // 去除标记文本
          const content = text.replace(/\[!WARNING\]|\[!NOTE\]|\[!SUCCESS\]/, '').trim();

          if (isWarning) {
            return (
              <div className="my-4 border-l-4 border-yellow-500 bg-yellow-500/10 p-4 sm:p-4 rounded-r-lg text-yellow-700 dark:text-yellow-400 text-sm sm:text-base">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle size={18} />
                  警告
                </div>
                <div>{content}</div>
              </div>
            );
          }

          if (isNote) {
            return (
              <div className="my-4 border-l-4 border-blue-500 bg-blue-500/10 p-4 sm:p-4 rounded-r-lg text-blue-700 dark:text-blue-400 text-sm sm:text-base">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Info size={18} />
                  信息
                </div>
                <div>{content}</div>
              </div>
            );
          }

          if (isSuccess) {
            return (
              <div className="my-4 border-l-4 border-green-500 bg-green-500/10 p-4 sm:p-4 rounded-r-lg text-green-700 dark:text-green-400 text-sm sm:text-base">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle size={18} />
                  成功
                </div>
                <div>{content}</div>
              </div>
            );
          }

          // 默认的 blockquote 样式
          return (
            <blockquote className="my-4 pl-4 border-l-4 border-primary/30 bg-muted/30 py-2 italic text-muted-foreground text-sm sm:text-base">
              {children}
            </blockquote>
          );
        },
    a: CustomLink,
    img: ({ src, alt }) => {
      return (
        <span className="block my-6 flex justify-center relative w-full">
          <div className="relative w-full max-w-full max-h-[600px] sm:max-h-[400px]">
            <Zoom>
              <Image 
                src={src as string} 
                alt={alt || ''} 
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-xl shadow-lg cursor-zoom-in"
              />
            </Zoom>
          </div>
          {alt && (
            <span className="block text-center text-sm text-muted-foreground mt-2 italic">
              {alt}
            </span>
          )}
        </span>
      );
    },
    code(props) {
      const p = props as {
        inline?: boolean;
        className?: string;
        children?: React.ReactNode;
        meta?: string;
      } & Record<string, unknown>;
      const match = /language-(\w+)/.exec(p.className || '');
      
      if (!p.inline && match) {
        const code = String(p.children).replace(/\n$/, '');
        return <div className="sm:ml-0 ml-[-1rem] sm:mr-0 mr-[-1rem]"><CodeBlock code={code} language={match[1]} meta={p.meta} /></div>;
      }
      
      return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          {p.children}
        </code>
      );
    },
    table: ({ children }) => {
      return (
        <div className="my-6 overflow-x-auto sm:ml-0 ml-[-1rem] sm:mr-0 mr-[-1rem]">
          <table className="min-w-full border-collapse">
            {children}
          </table>
        </div>
      );
    },
    th: ({ children }) => {
      return (
        <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
          {children}
        </th>
      );
    },
    td: ({ children }) => {
      return (
        <td className="border border-border px-4 py-2">
          {children}
        </td>
      );
    },
    hr: () => {
          return <hr className="my-6 border-border" />;
        },

  }), []);

  // 使用useMemo优化rehypePlugins，避免每次渲染都重新创建
  const rehypePlugins = useMemo(() => [rehypeSanitize(customSchema) as any], []);
  
  // 使用useMemo优化remarkPlugins，避免每次渲染都重新创建
  const remarkPlugins = useMemo(() => [remarkGfm as any], []);

  // 使用pangu处理中英文混排，自动添加空格
  const processedSource = useMemo(() => {
    // 使用正确的 pangu 方法
    return pangu.spacingText(source);
  }, [source]);

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={components}
    >
      {processedSource}
    </ReactMarkdown>
  );
};

export default MdxContent;
