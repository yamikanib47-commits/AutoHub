import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  variant = 'light',
  className = ''
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={`markdown-content ${className} ${isDark ? 'text-gray-200' : 'text-[#1A1A1F]'}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={`text-base font-extrabold mt-3 mb-1.5 first:mt-0 tracking-tight ${isDark ? 'text-white' : 'text-[#1A1A1F]'}`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-sm font-bold mt-3 mb-1.5 first:mt-0 tracking-tight ${isDark ? 'text-white' : 'text-[#1A1A1F]'}`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`text-xs sm:text-sm font-bold mt-2.5 mb-1 first:mt-0 ${isDark ? 'text-white' : 'text-[#1A1A1F]'}`}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className={`text-xs font-bold mt-2 mb-1 first:mt-0 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-xs sm:text-sm leading-relaxed mb-2 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-4 space-y-1 mb-2 text-xs sm:text-sm">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-4 space-y-1 mb-2 text-xs sm:text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className={`font-bold ${isDark ? 'text-white' : 'text-[#1A1A1F]'}`}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic opacity-90">{children}</em>
          ),
          hr: () => (
            <hr className={`my-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`} />
          ),
          blockquote: ({ children }) => (
            <blockquote className={`border-l-3 pl-3 py-1 my-2 rounded-r text-xs sm:text-sm italic ${
              isDark 
                ? 'border-[#C8F169] bg-white/5 text-gray-300' 
                : 'border-[#2D5CF6] bg-blue-50/60 text-gray-700'
            }`}>
              {children}
            </blockquote>
          ),
          code: ({ children, className: codeClassName }) => {
            const isBlock = codeClassName?.includes('language-');
            if (isBlock) {
              return (
                <div className={`my-2 p-3 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed border ${
                  isDark ? 'bg-black/40 border-white/10 text-[#C8F169]' : 'bg-gray-900 border-gray-800 text-gray-100'
                }`}>
                  <code>{children}</code>
                </div>
              );
            }
            return (
              <code className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold ${
                isDark ? 'bg-white/10 text-emerald-300' : 'bg-gray-100 text-[#1E3A8A]'
              }`}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className={`my-3 overflow-x-auto rounded-xl border shadow-2xs ${
              isDark ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-white'
            }`}>
              <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className={`border-b text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-white/10 border-white/10 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}>
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 font-bold whitespace-nowrap">
              {children}
            </th>
          ),
          tbody: ({ children }) => (
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className={`transition-colors ${
              isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/30'
            }`}>
              {children}
            </tr>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 text-xs align-top">
              {children}
            </td>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noreferrer" 
              className={`font-semibold underline underline-offset-2 ${
                isDark ? 'text-[#C8F169] hover:text-white' : 'text-[#2D5CF6] hover:text-blue-800'
              }`}
            >
              {children}
            </a>
          )
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
