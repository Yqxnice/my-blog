/**
 * 功能：代码块组件
 * 目的：显示代码高亮，支持复制功能和行高亮
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
  
  // 解析meta字符串，提取文件名和高亮行
  const parseMeta = (meta?: string) => {
    if (!meta) return { title: '', highlightLines: [] };
    
    // 提取文件名
    const titleMatch = meta.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : '';
    
    // 提取高亮行
    const highlightMatch = meta.match(/\{(\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)\}/);
    let highlightLines: number[] = [];
    
    if (highlightMatch) {
      const ranges = highlightMatch[1].split(',');
      ranges.forEach(range => {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            highlightLines.push(i);
          }
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
    <span className="block my-4 search-scrollbar">
      <span className="flex items-center justify-between bg-[#282c34] text-gray-300 px-4 py-2 text-sm rounded-t-xl">
        <div className="flex items-center gap-2">
          <span>{language}</span>
          {title && <span className="text-gray-400 text-xs">{title}</span>}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? '已复制' : '复制'}
        </button>
      </span>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="!mt-0 !rounded-t-none !rounded-b-xl overflow-x-auto"
        showLineNumbers={true}
        wrapLines={true}
        lineProps={(lineNumber: number) => {
          return {
            style: {
              backgroundColor: highlightLines.includes(lineNumber) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              paddingLeft: '12px',
              borderLeft: highlightLines.includes(lineNumber) ? '2px solid #c0392b' : 'none'
            }
          };
        }}
      >
        {code}
      </SyntaxHighlighter>
    </span>
  );
};

export default CodeBlock;