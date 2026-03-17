'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MdxContentProps {
  source: string;
}

const MdxContent: React.FC<MdxContentProps> = ({ source }) => {
  const generateId = (text: string) => {
    return text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
  };

  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => {
          const text = String(children);
          const id = generateId(text);
          return <h1 id={id} className="text-3xl font-bold mt-8 mb-4">{children}</h1>;
        },
        h2: ({ children }) => {
          const text = String(children);
          const id = generateId(text);
          return <h2 id={id} className="text-2xl font-semibold mt-6 mb-3">{children}</h2>;
        },
        h3: ({ children }) => {
          const text = String(children);
          const id = generateId(text);
          return <h3 id={id} className="text-xl font-medium mt-4 mb-2">{children}</h3>;
        },
        a: ({ children, href, ...props }) => {
          // 检查是否为内部链接（以 / 开头）
          const isInternal = href && (href.startsWith('/') || href.startsWith('#'));
          
          // 检查是否为博客文章链接（格式：/blogs/{slug}）
          const blogMatch = href && href.match(/^\/blogs\/(\w+)/);
          
          if (blogMatch) {
            // 对于博客文章链接，使用卡片样式
            // 使用 span 并设置 display: block 来避免 HTML 嵌套错误
            return (
              <span className="block mb-4">
                <a 
                  href={href} 
                  className="block bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  {...props}
                >
                  <span className="text-lg font-semibold mb-2 text-foreground">{children}</span>
                  <span className="text-muted-foreground text-sm mb-3 line-clamp-2">点击查看完整内容</span>
                </a>
              </span>
            );
          }
          
          return (
            <a 
              href={href} 
              className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200 font-medium" 
              target={isInternal ? undefined : "_blank"} 
              rel={isInternal ? undefined : "noopener noreferrer"}
              {...props}
            >
              {children}
            </a>
          );
        },
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {source}
    </ReactMarkdown>
  );
};

export default MdxContent;
