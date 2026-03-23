'use client';

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const langMap: Record<string, string> = {
  typescript: 'TypeScript',
  ts: 'TypeScript',
  javascript: 'JavaScript',
  js: 'JavaScript',
  jsx: 'JSX',
  tsx: 'TSX',
  css: 'CSS',
  json: 'JSON',
  bash: 'Bash',
  shell: 'Shell',
  python: 'Python',
};

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = code;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      {/* Language label */}
      <span className="absolute top-2 left-3 text-[10px] text-[#7c8491] font-mono z-10 select-none">
        {langMap[language] || language}
      </span>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        aria-label={copied ? '已复制' : '复制代码'}
        className={`
          absolute top-1.5 right-2 z-10
          flex items-center gap-1 px-2 py-1
          text-[10px] font-mono rounded
          transition-all duration-200
          ${copied
            ? 'text-emerald-400 bg-emerald-400/10'
            : 'text-[#7c8491] bg-transparent opacity-0 group-hover:opacity-100 hover:text-[#cdd6f4] hover:bg-white/5'
          }
        `}
      >
        {copied ? (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            已复制
          </>
        ) : (
          <>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            复制
          </>
        )}
      </button>

      <pre className="bg-[#1e1e2e] text-[#cdd6f4] rounded-lg pt-8 pb-4 px-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
        <code className="whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
