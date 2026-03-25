'use client';

import React, { useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';
import CodeBlock from './CodeBlock';
import { ExternalLink, MonitorPlay } from 'lucide-react';
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
          className="text-blue-600 dark:text-blue-400 font-semibold underline decoration-blue-300 dark:decoration-blue-700 underline-offset-4 hover:decoration-blue-500 dark:hover:decoration-blue-500 transition-all break-words"
        >
          {children}
        </Link>
      );
    }
    return (
      <Link href={hrefString} className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-words">
        {children}
      </Link>
    );
  }



  const imageMatch = hrefString.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
  if (imageMatch) {
    return (
      <a href={hrefString} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-500 hover:underline transition-colors duration-200 font-medium inline-flex items-center gap-0.5 break-all" target="_blank" rel="noopener noreferrer" {...props}>
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
            <span className="flex flex-row items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 p-3 sm:p-4 w-full">
              <span className="shrink-0">
                <img src={faviconUrl} alt={`${siteName} logo`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {siteName.charAt(0).toUpperCase() + siteName.slice(1)}
                </span>
                <span className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">
                  {hrefString}
                </span>
              </span>
              <span className="shrink-0 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <ExternalLink size={16} className="sm:w-5 sm:h-5" />
              </span>
            </span>
          </a>
        </span>
      );
    }
  }

  return (
    <a href={hrefString} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-500 hover:underline transition-colors duration-200 font-medium inline-flex items-center gap-0.5 break-words" target="_blank" rel="noopener noreferrer" {...props}>
      <span className="break-words">{children}</span>
      <ExternalLink size={12} className="shrink-0 opacity-60 relative -top-0.5" />
    </a>
  );
};

export default function MdxContent({ source }: MdxContentProps) {
  const components = useMemo<Components>(() => ({
    h1: ({ children }) => <h1 id={generateId(String(children))} className="text-2xl sm:text-3xl font-bold mt-8 mb-4 scroll-mt-24 break-words text-gray-900 dark:text-white">{children}</h1>,
    h2: ({ children }) => <h2 id={generateId(String(children))} className="text-xl sm:text-2xl font-bold mt-8 mb-3 scroll-mt-24 break-words border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">{children}</h2>,
    h3: ({ children }) => <h3 id={generateId(String(children))} className="text-lg sm:text-xl font-semibold mt-6 mb-3 scroll-mt-24 break-words text-gray-900 dark:text-white">{children}</h3>,
    h4: ({ children }) => <h4 id={generateId(String(children))} className="text-base sm:text-lg font-medium mt-4 mb-2 scroll-mt-24 break-words text-gray-900 dark:text-white">{children}</h4>,
    
    p: ({ children }) => <p className="mb-5 leading-relaxed text-[15px] sm:text-base break-words text-gray-800 dark:text-gray-200">{children}</p>,
    
    ul: ({ children }) => <ul className="mb-5 pl-5 list-disc space-y-2 text-[15px] sm:text-base break-words text-gray-800 dark:text-gray-200 marker:text-gray-500 dark:marker:text-gray-400">{children}</ul>,
    ol: ({ children }) => <ol className="mb-5 pl-5 list-decimal space-y-2 text-[15px] sm:text-base break-words text-gray-800 dark:text-gray-200 marker:text-gray-500 dark:marker:text-gray-400">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
    
    blockquote: ({ children }) => (
      <blockquote className="my-5 pl-4 border-l-[3px] border-blue-500 bg-gray-50 dark:bg-gray-800 py-3 pr-3 rounded-r-xl italic text-gray-600 dark:text-gray-400 text-[15px] sm:text-base break-words">
        {children}
      </blockquote>
    ),
    
    a: CustomLink,
    
    img: ({ src, alt }) => (
      <span className="block my-8 text-center w-full">
        <span>
          <Image
            src={src as string}
            alt={alt || ''}
            width={1200}
            height={800}
            style={{ width: '100%', height: 'auto', maxHeight: '60vh', objectFit: 'contain' }}
            className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-zoom-in mx-auto"
          />
        </span>
        {alt && <span className="block text-center text-sm text-gray-600 dark:text-gray-400 mt-2.5 italic px-2 break-words">{alt}</span>}
      </span>
    ),
    
    code(props) {
      const p = props as { inline?: boolean; className?: string; children?: React.ReactNode; meta?: string; } & Record<string, unknown>;
      const match = /language-(\w+)/.exec(p.className || '');
      
      if (!p.inline && match) {
        const code = String(p.children).replace(/\n$/, '');
        return <div className="w-full max-w-full"><CodeBlock code={code} language={match[1]} meta={p.meta} /></div>;
      }
      return (
        <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 mx-0.5 rounded-md text-[0.85em] font-mono break-words border border-gray-200 dark:border-gray-700">
          {p.children}
        </code>
      );
    },
    
    table: ({ children }) => (
      <div className="my-6 w-full max-w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <table className="w-full border-collapse text-sm sm:text-[15px] text-left">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => <th className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{children}</th>,
    td: ({ children }) => <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 break-words text-gray-800 dark:text-gray-200">{children}</td>,
    hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,

  }), []);

  const rehypePlugins = useMemo(() => [rehypeSanitize(customSchema) as any], []);
  const remarkPlugins = useMemo(() => [remarkGfm as any], []);

  return (
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
}
