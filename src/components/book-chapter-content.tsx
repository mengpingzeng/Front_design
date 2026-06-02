"use client"

import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

type BookChapterContentProps = {
  content: string
  className?: string
}

export function BookChapterContent({ content, className }: BookChapterContentProps) {
  if (!content.trim()) {
    return <p className="text-[15px] text-slate-400">暂无内容</p>
  }

  return (
    <article
      className={cn(
        "book-chapter-content text-[15px] text-slate-700 leading-[1.85]",
        className,
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-slate-900 mt-0 mb-4 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-justify indent-[2em] last:mb-0">{children}</p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-slate-200 pl-4 text-slate-500 italic">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc pl-8 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal pl-8 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-[1.85]">{children}</li>,
          hr: () => <hr className="my-8 border-slate-200" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-slate-600">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
