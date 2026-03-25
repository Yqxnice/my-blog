/**
 * 功能：MDX内容渲染组件
 * 目的：渲染MDX格式的内容，极致适配移动端防溢出
 * 作者：Yqxnice
 */
'use client';

import React, { useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';
import CodeBlock from './CodeBlock';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { AlertTriangle, Info, CheckCircle, ExternalLink, MonitorPlay } from 'lucide-react';
import slugger from 'github-slugger';

interface MdxContentProps {
  source: string;
}

const customSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] || []), 'className', 'class'],
    a: [...(defaultSchema.attributes?.a || []), 'className', 'class', 'target', 'rel'],
    img: [...(defaultSchema.attributes?.img || []), 'className', 'class', 'loading', 'width', 'height'],
    code: [...(defaultSchema.attributes?.code || []), 'className', 'class'],
    table: [...(defaultSchema.attributes?.table || []), 'className', 'class'],
    th: [...(defaultSchema.attributes?.th || []), 'className', 'class'],
    td: [...(defaultSchema.attributes?.td || []), 'className', 'class'],
  },
  tagNames: defaultSchema.tagNames,
};

const generateId = (text: string) => {
  const slug = new slugger();
  return slug.slug(text);
};

const CustomLink = ({ href, children, ...props }: any) => {
  const hrefString = href || '';
  const isInternal = hrefString.startsWith('/') || hrefString.startsWith('#');
  const isStandaloneUrl = typeof children === 'string' && children === hrefString;

  if (isInternal) {
    if (hrefString.startsWith('/blogs/')) {
      return (
        <Link 
          href={hrefString} 
          className="text-primary hover:text-primary/80 font-semibold underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all break-words"
        >
          {children}
        </Link>
      );
    }
    return (
      <Link href={hrefString} className="text-primary hover:underline font-medium break-words">
        {children}
      </Link>
    );
  }

  const bilibiliMatch = hrefString.match(/bilibili\.com\/video\/(BV\w+)/);
  if (bilibiliMatch) {
    return (
      <span className="block my-6 w-full max-w-full sm:max-w-3xl mx-auto rounded-xl overflow-hidden shadow-md border border-border bg-muted">
        <span className="flex items-center gap-2 bg-secondary px-3 py-2 text-[11px] sm:text-xs text-muted-foreground border-b border-border">
          <MonitorPlay size={14} className="shrink-0" /> Bilibili Video
        </span>
        <span className="block w-full aspect-video">
          <iframe
            src={`//player.bilibili.com/player.html?bvid=${bilibiliMatch[1]}&page=1&high_quality=1&danmaku=0`}
            scrolling="no"
            frameBorder={0}
            allowFullScreen={true}
            className="w-full h-full"
          />
        </span>
      </span>
    );
  }

  const imageMatch = hrefString.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
  if (imageMatch) {
    return (
      <a href={hrefString} className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200 font-medium inline-flex items-center gap-0.5 break-all" target="_blank" rel="noopener noreferrer" {...props}>
        {children}
        <ExternalLink size={12} className="shrink-0 opacity-60 relative -top-0.5" />
      </a>
    );
  }

  if (isStandaloneUrl) {
    let domain = '';
    let faviconUrl = '';
    let siteName = '';
    let isValidUrl = false;
    
    try {
      const url = new URL(hrefString);
      domain = url.hostname;
      faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
      siteName = domain.replace(/^www\./, '').split('.')[0];
      isValidUrl = true;
    } catch {
      // 忽略
    }
    
    if (isValidUrl) {
      return (
        <span className="block my-4 sm:my-6 w-full max-w-full">
          <a href={hrefString} target="_blank" rel="noopener noreferrer" className="block group no-underline max-w-2xl mx-auto w-full">
            <span className="flex flex-row items-center gap-3 border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/50 transition-all duration-200 bg-card p-3 sm:p-4 w-full">
              <span className="shrink-0">
                <img src={faviconUrl} alt={`${siteName} logo`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm sm:text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {siteName.charAt(0).toUpperCase() + siteName.slice(1)}
                </span>
                <span className="block text-[11px] sm:text-sm text-muted-foreground truncate mt-0.5">
                  {hrefString}
                </span>
              </span>
              <span className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                <ExternalLink size={16} className="sm:w-5 sm:h-5" />
              </span>
            </span>
          </a>
        </span>
      );
    }
  }

  return (
    <a href={hrefString} className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200 font-medium inline-flex items-center gap-0.5 break-words" target="_blank" rel="noopener noreferrer" {...props}>
      <span className="break-words">{children}</span>
      <ExternalLink size={12} className="shrink-0 opacity-60 relative -top-0.5" />
    </a>
  );
};

const MdxContent: React.FC<MdxContentProps> = ({ source }) => {
  const components = useMemo<Components>(() => ({
    h1: ({ children }) => <h2 id={generateId(String(children))} className="text-xl sm:text-2xl font-bold mt-8 mb-4 scroll-mt-24 break-words">{children}</h2>,
    h2: ({ children }) => <h2 id={generateId(String(children))} className="text-[1.15rem] sm:text-xl font-bold mt-8 mb-3 scroll-mt-24 break-words border-b border-border/50 pb-2">{children}</h2>,
    h3: ({ children }) => <h3 id={generateId(String(children))} className="text-lg sm:text-[1.15rem] font-semibold mt-6 mb-3 scroll-mt-24 break-words">{children}</h3>,
    h4: ({ children }) => <h4 id={generateId(String(children))} className="text-base sm:text-lg font-medium mt-4 mb-2 scroll-mt-24 break-words">{children}</h4>,
    
    // [优化] 添加 break-words 彻底防止英文长词撑破移动端屏幕
    p: ({ children }) => <p className="mb-5 leading-relaxed text-[15px] sm:text-base break-words text-foreground/90">{children}</p>,
    
    // [优化] 列表的缩进改为 pl-5，比 ml 更安全，不会导致容器外溢
    ul: ({ children }) => <ul className="mb-5 pl-5 list-disc space-y-2 text-[15px] sm:text-base break-words marker:text-muted-foreground/70">{children}</ul>,
    ol: ({ children }) => <ol className="mb-5 pl-5 list-decimal space-y-2 text-[15px] sm:text-base break-words marker:text-muted-foreground/70">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
    
    blockquote: ({ children }) => {
      const text = String(children);
      const isWarning = text.includes('[!WARNING]');
      const isNote = text.includes('[!NOTE]');
      const isSuccess = text.includes('[!SUCCESS]');
      const content = text.replace(/\[!WARNING\]|\[!NOTE\]|\[!SUCCESS\]/, '').trim();

      if (isWarning) return (
        <div className="my-5 border-l-[3px] border-yellow-500 bg-yellow-500/10 p-3.5 sm:p-4 rounded-r-xl text-yellow-700 dark:text-yellow-400 text-[14px] sm:text-[15px]">
          <div className="flex items-center gap-2 font-bold mb-1.5 text-yellow-600 dark:text-yellow-500"><AlertTriangle size={16} className="shrink-0" />警告</div>
          <div className="break-words leading-relaxed">{content}</div>
        </div>
      );
      if (isNote) return (
        <div className="my-5 border-l-[3px] border-blue-500 bg-blue-500/10 p-3.5 sm:p-4 rounded-r-xl text-blue-700 dark:text-blue-400 text-[14px] sm:text-[15px]">
          <div className="flex items-center gap-2 font-bold mb-1.5 text-blue-600 dark:text-blue-500"><Info size={16} className="shrink-0" />信息</div>
          <div className="break-words leading-relaxed">{content}</div>
        </div>
      );
      if (isSuccess) return (
        <div className="my-5 border-l-[3px] border-green-500 bg-green-500/10 p-3.5 sm:p-4 rounded-r-xl text-green-700 dark:text-green-400 text-[14px] sm:text-[15px]">
          <div className="flex items-center gap-2 font-bold mb-1.5 text-green-600 dark:text-green-500"><CheckCircle size={16} className="shrink-0" />成功</div>
          <div className="break-words leading-relaxed">{content}</div>
        </div>
      );
      return (
        <blockquote className="my-5 pl-4 border-l-[3px] border-primary/40 bg-muted/30 py-3 pr-3 rounded-r-xl italic text-muted-foreground text-[15px] sm:text-base break-words">
          {children}
        </blockquote>
      );
    },
    
    a: CustomLink,
    
    img: ({ src, alt }) => (
      <span className="block my-8 text-center w-full">
        <Zoom>
          <Image
            src={src as string}
            alt={alt || ''}
            width={1200}
            height={800}
            style={{ width: '100%', height: 'auto', maxHeight: '60vh', objectFit: 'contain' }}
            className="rounded-xl shadow-sm border border-border/50 cursor-zoom-in mx-auto"
          />
        </Zoom>
        {alt && <span className="block text-center text-[13px] text-muted-foreground mt-2.5 italic px-2 break-words">{alt}</span>}
      </span>
    ),
    
    code(props) {
      const p = props as { inline?: boolean; className?: string; children?: React.ReactNode; meta?: string; } & Record<string, unknown>;
      const match = /language-(\w+)/.exec(p.className || '');
      
      if (!p.inline && match) {
        const code = String(p.children).replace(/\n$/, '');
        // [优化] 移除可能导致移动端溢出的负边距，让外层容器负责边距
        return <div className="w-full max-w-full"><CodeBlock code={code} language={match[1]} meta={p.meta} /></div>;
      }
      return (
        <code className="bg-muted/80 text-primary px-1.5 py-0.5 mx-0.5 rounded-md text-[0.85em] font-mono break-words border border-border/50">
          {p.children}
        </code>
      );
    },
    
    table: ({ children }) => (
      // [优化] 同样移除负边距，用 w-full 和 overflow-x-auto 优雅处理表格滑动
      <div className="my-6 w-full max-w-full overflow-x-auto search-scrollbar border border-border rounded-xl" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <table className="w-full border-collapse text-sm sm:text-[15px] text-left">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => <th className="border-b border-border px-4 py-3 bg-muted/50 font-semibold text-foreground whitespace-nowrap">{children}</th>,
    td: ({ children }) => <td className="border-b border-border px-4 py-3 break-words text-foreground/90">{children}</td>,
    hr: () => <hr className="my-8 border-border/60" />,

  }), []);

  const rehypePlugins = useMemo(() => [rehypeSanitize(customSchema) as any], []);
  const remarkPlugins = useMemo(() => [remarkGfm as any], []);

  return (
    // [非常重要] 必须去掉外层的 pangu.spacingText(source)，它会摧毁你的 markdown 语法！
    // 如果你必须要中英文空格，请去寻找 remark-pangu 这个标准的 AST 插件。
    <div className="w-full max-w-full overflow-x-hidden px-4 md:px-0">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
};

export default MdxContent;
