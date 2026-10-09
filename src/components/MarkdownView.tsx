import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  // Split content by code blocks: ```lang ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-slate-200 text-sm md:text-base">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          return <CodeSnippet key={index} rawBlock={part} />;
        }
        return <FormattedText key={index} text={part} />;
      })}
    </div>
  );
};

const CodeSnippet: React.FC<{ rawBlock: string }> = ({ rawBlock }) => {
  const [copied, setCopied] = useState(false);

  // Extract language and code body
  const lines = rawBlock.slice(3, -3).split('\n');
  const language = lines[0].trim() || 'code';
  const code = lines.slice(1).join('\n').replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700/70 bg-[#090d21] shadow-xl">
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0d1430] border-b border-slate-700/50 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold uppercase tracking-wider text-blue-300">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto text-xs md:text-sm font-mono text-emerald-300 bg-[#060a1a]">
        <pre className="whitespace-pre">{code}</pre>
      </div>
    </div>
  );
};

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-lg md:text-xl font-bold text-white pt-2 text-blue-300 font-heading flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full inline-block" />
              {parseInlineStyles(trimmed.slice(4))}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl md:text-2xl font-bold text-white pt-3 pb-1 border-b border-slate-800 text-purple-200 font-heading">
              {parseInlineStyles(trimmed.slice(3))}
            </h2>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-2xl md:text-3xl font-extrabold text-white pt-4 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 font-heading">
              {parseInlineStyles(trimmed.slice(2))}
            </h1>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 text-slate-200">
              <span className="text-purple-400 mt-1.5 text-xs">●</span>
              <div className="flex-1">{parseInlineStyles(trimmed.slice(2))}</div>
            </div>
          );
        }

        // Numbered lists
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 text-slate-200">
              <span className="text-xs font-mono font-bold text-blue-400 mt-1 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">
                {numMatch[1]}
              </span>
              <div className="flex-1">{parseInlineStyles(numMatch[2])}</div>
            </div>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <div key={idx} className="border-l-2 border-purple-500/80 bg-purple-950/20 px-3 py-1.5 rounded-r-lg text-slate-300 italic text-sm my-1">
              {parseInlineStyles(trimmed.slice(2))}
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-200">
            {parseInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
};

// Parses bold **text**, inline `code`, and links
function parseInlineStyles(str: string): React.ReactNode[] {
  // Regex splitting by bold, inline code, and URLs
  const tokens = str.split(/(\*\*.*?\*\*|`.*?`)/g);

  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-800/90 text-purple-300 font-mono text-xs border border-purple-900/40"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
}
