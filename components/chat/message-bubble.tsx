'use client'

import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check } from 'lucide-react'
import { JsonTreeViewer } from './json-tree-viewer'
import { CIAShieldIcon } from '@/components/cia-logo'
import { Button } from '@/components/ui/button'
import type { Message } from '@/lib/store'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
  userInitials?: string
}

export function MessageBubble({ message, userInitials = 'U' }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  
  // Check if content is JSON
  const jsonData = useMemo(() => {
    try {
      const trimmed = message.content.trim()
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        return JSON.parse(trimmed)
      }
    } catch {
      // Not valid JSON
    }
    return null
  }, [message.content])
  
  return (
    <div 
      className={cn(
        'flex gap-4 message-enter',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm',
        isUser 
          ? 'bg-primary text-primary-foreground text-xs font-semibold' 
          : 'bg-surface border border-border'
      )}>
        {isUser ? userInitials : <CIAShieldIcon size={20} />}
      </div>
      
      {/* Content */}
      <div className={cn(
        'max-w-[85%] rounded-2xl px-5 py-4 shadow-sm',
        isUser 
          ? 'bg-surface border-l-4 border-l-primary border-y border-r border-border text-foreground' 
          : 'bg-card border border-border text-foreground'
      )}>
        {jsonData ? (
          <JsonTreeViewer data={jsonData} />
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className, ...rest } = props
                  const match = /language-(\w+)/.exec(className || '')
                  const codeString = String(children).replace(/\n$/, '')
                  
                  if (match) {
                    return (
                      <CodeBlock 
                        code={codeString} 
                        language={match[1]} 
                      />
                    )
                  }
                  
                  return (
                    <code 
                      className="px-1.5 py-0.5 rounded bg-surface border border-border text-foreground font-mono text-xs font-medium" 
                      {...rest}
                    >
                      {children}
                    </code>
                  )
                },
                // Style other markdown elements
                h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold mt-3 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>,
                p: ({ children }) => <p className="leading-relaxed mb-2">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground my-2">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full border border-border rounded-lg overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-surface">{children}</thead>,
                th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-semibold border-b border-border">{children}</th>,
                td: ({ children }) => <td className="px-3 py-2 text-sm border-b border-border">{children}</td>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

interface CodeBlockProps {
  code: string
  language: string
}

function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="relative rounded-lg overflow-hidden border border-border my-3 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-border">
        <span className="text-xs text-foreground font-semibold uppercase">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <Check className="w-3 h-3 mr-1 text-primary" />
          ) : (
            <Copy className="w-3 h-3 mr-1" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      
      {/* Code */}
      <pre className="p-4 bg-[#1A1A1A] overflow-x-auto">
        <code className="text-xs font-mono text-[#F7F7F5] whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  )
}

export function StreamingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 shadow-sm">
        <CIAShieldIcon size={20} />
      </div>
      <div className="bg-card border border-border rounded-2xl px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Generating response...</span>
        </div>
      </div>
    </div>
  )
}
