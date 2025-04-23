"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

type MarkdownProps = {
  content: string | null
}
// Add a helper function to detect if text is primarily Arabic
function isPrimarilyArabic(text: string): boolean {
  // Arabic Unicode range: \u0600-\u06FF
  const arabicChars = text.replace(/[^\u0600-\u06FF]/g, "").length
  return arabicChars > text.length * 0.3 // If more than 30% is Arabic, consider it Arabic text
}

export function Markdown({ content }: MarkdownProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const isArabic = content ? isPrimarilyArabic(content) : false

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="animate-pulse h-96 bg-muted rounded-md"></div>
  }
  
  if (!content) {
    return <div className="text-muted-foreground text-center py-8">No content available</div>
  }

  return (
    <div className={cn(isArabic && "font-arabic", isArabic && "rtl")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : ""

            return !inline ? (
              <SyntaxHighlighter
                style={theme === "dark" ? (vscDarkPlus as any) : (vs as any)}
                language={language}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
  
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          img({ node, ...props }) {
            return <img className="max-w-full h-auto rounded-md my-4" {...props} />
          },
          a({ node, ...props }) {
            return <a className="text-yemen-red hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
          },
          h1({ node, ...props }) {
            return (
              <h1 className={cn("text-2xl font-bold mt-6 mb-4", isArabic && "font-arabic text-right")} {...props} />
            )
          },
          h2({ node, ...props }) {
            return <h2 className={cn("text-xl font-bold mt-5 mb-3", isArabic && "font-arabic text-right")} {...props} />
          },
          h3({ node, ...props }) {
            return <h3 className={cn("text-lg font-bold mt-4 mb-2", isArabic && "font-arabic text-right")} {...props} />
          },
          p({ node, ...props }) {
            return <p className={cn("my-4", isArabic && "font-arabic text-right")} {...props} />
          },
          
          ul({ node, ordered, ...props }) {
            return (
              <ul
                {...props}
                suppressHydrationWarning
                className={cn("list-disc pl-6 my-4", isArabic && "pr-6 pl-0")} 
                {...(ordered !== undefined && { ordered: ordered.toString() })}
              />
            );
          },
          ol({ node, ordered, ...props }) {
            return (
              <ol
                {...props}
                suppressHydrationWarning
                className={cn(
                  isArabic && "font-arabic text-right",
                  props.className 
                )}
                {...(ordered !== undefined && { ordered: ordered.toString() })}
              />
            );
          },

          li({ node, ordered, ...props }) {
            return (
              <li
                {...props}
                suppressHydrationWarning
                className={cn(
                  isArabic && "font-arabic text-right",
                  props.className 
                )}
                {...(ordered !== undefined && { ordered: ordered.toString() })}
              />
            );
          },
          table({ node, ...props }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-border" {...props} />
              </div>
            )
          },
          thead({ node, ...props }) {
            return <thead className="bg-muted" {...props} />
          },
          th({ node, ...props }) {
            return <th className={cn("px-4 py-2 text-left font-medium", isArabic && "text-right")} {...props} />
          },
        
          td({ node, isHeader, ...props }) {
            return (
              <td
                {...props}
                suppressHydrationWarning
                className={cn(
                  "px-4 py-2 border-t border-border", 
                  isArabic && "text-right", 
                  isHeader && "font-bold"
                )}
              />
            );
          },
          

          blockquote({ node, ...props }) {
            return (
              <blockquote
                className={cn(
                  "border-l-4 pl-4 italic my-4 border-muted-foreground/30",
                  isArabic && "border-r-4 border-l-0 pr-4 pl-0",
                )}
                {...props}
              />
            )
          },
        }}
      >
         {content}
      </ReactMarkdown>
    </div>
  )
}

