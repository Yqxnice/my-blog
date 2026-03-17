import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  // 提取语言信息
  const language = className?.replace(/language-/, '') || 'javascript';

  return (
    <div className="my-4 rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 text-xs text-muted-foreground border-b border-border">
        {language}
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        className="p-4 text-sm"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;