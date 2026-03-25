import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
    <div className="my-4 rounded-xl overflow-hidden w-full max-w-full bg-background shadow-sm border border-border">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between bg-secondary text-muted-foreground px-3 sm:px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <span className="shrink-0 text-muted-foreground text-xs font-mono uppercase tracking-wider">
            {language}
          </span>
          {title && (
            <span className="text-muted-foreground/80 text-xs truncate">
              {title}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 shrink-0 ml-2
                     min-w-[32px] min-h-[32px] sm:min-w-[28px] sm:min-h-[28px] px-2 py-1 rounded-md
                     hover:bg-secondary/80 hover:text-foreground active:scale-95 transition-all touch-manipulation"
          aria-label={copied ? '已复制' : '复制代码'}
        >
          {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
          <span className="hidden sm:inline text-xs font-medium">{copied ? '已复制' : '复制'}</span>
        </button>
      </div>

      {/* 滚动区域 */}
      <div
        className="overflow-x-auto w-full"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <SyntaxHighlighter
          style={{
            ...oneLight,
            'code[class*="language-"]': {
              ...oneLight['code[class*="language-"]'],
              backgroundColor: 'transparent',
            },
            'pre[class*="language-"]': {
              ...oneLight['pre[class*="language-"]'],
              backgroundColor: 'transparent',
            },
          }}
          language={language}
          PreTag="div"
          className="!mt-0 !bg-transparent !rounded-none !text-sm sm:!text-sm !p-4"
          showLineNumbers={true}
          lineProps={(lineNumber: number) => ({
            style: {
              backgroundColor: highlightLines.includes(lineNumber)
                ? 'rgba(192, 57, 43, 0.1)'
                : 'transparent',
              paddingLeft: '12px',
              borderLeft: highlightLines.includes(lineNumber)
                ? '3px solid #c0392b'
                : '3px solid transparent',
              display: 'block',
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
