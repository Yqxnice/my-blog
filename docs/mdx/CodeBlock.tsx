/**
 * 功能：代码块组件
 * 目的：显示代码高亮，支持复制功能和行高亮，极致适配移动端
 * 作者：Yqxnice
 */
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  meta?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, meta }) => {
  const [copied, setCopied] = useState(false);

  const parseMeta = (meta?: string) => {
    if (!meta) return { title: '', highlightLines: [] };

    const titleMatch = meta.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : '';

    const highlightMatch = meta.match(/\{(\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)\}/);
    let highlightLines: number[] = [];

    if (highlightMatch) {
      const ranges = highlightMatch[1].split(',');
      ranges.forEach(range => {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          for (let i = start; i <= end; i++) highlightLines.push(i);
        } else {
          highlightLines.push(Number(range));
        }
      });
    }

    return { title, highlightLines };
  };

  const { title, highlightLines } = parseMeta(meta);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  return (
    // [优化] 添加 w-full 和 max-w-full，严格防止在移动端撑破父容器
    <div className="my-4 rounded-xl overflow-hidden w-full max-w-full bg-[#282c34] shadow-sm border border-border/50">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between bg-[#21252b] text-gray-300 px-3 sm:px-4 py-2 border-b border-gray-700/50">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <span className="shrink-0 text-gray-400 text-[11px] sm:text-xs font-mono uppercase tracking-wider">
            {language}
          </span>
          {title && (
            <span className="text-gray-500 text-[11px] sm:text-xs truncate">
              {title}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 shrink-0 ml-2
                     min-w-[32px] min-h-[32px] sm:min-w-[28px] sm:min-h-[28px] px-2 py-1 rounded-md
                     hover:bg-gray-700/50 hover:text-white active:scale-95 transition-all touch-manipulation"
          aria-label={copied ? '已复制' : '复制代码'}
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          <span className="hidden sm:inline text-xs font-medium">{copied ? '已复制' : '复制'}</span>
        </button>
      </div>

      {/* 滚动区域 */}
      <div
        className="overflow-x-auto search-scrollbar w-full"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          className="!mt-0 !bg-transparent !rounded-none !text-[13px] sm:!text-[14px] !p-4"
          showLineNumbers={true}
          lineProps={(lineNumber: number) => ({
            style: {
              backgroundColor: highlightLines.includes(lineNumber)
                ? 'rgba(255, 255, 255, 0.08)'
                : 'transparent',
              paddingLeft: '12px',
              borderLeft: highlightLines.includes(lineNumber)
                ? '3px solid #c0392b'
                : '3px solid transparent', // 保持透明边框防止宽度跳动
              display: 'block', // 确保整行背景色生效
            },
          })}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;