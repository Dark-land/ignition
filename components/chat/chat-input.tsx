'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Paperclip, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [])
  
  useEffect(() => {
    adjustHeight()
  }, [message, adjustHeight])
  
  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }
  
  const charCount = message.length
  const maxChars = 4000
  
  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="
        flex items-end gap-2 p-3 rounded-xl
        bg-surface border border-border
        focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20
        transition-all duration-200
      ">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask CIA about your cloud infrastructure..."
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none text-sm leading-relaxed',
            'min-h-[24px] max-h-[200px]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8"
            aria-label="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          {message && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMessage('')}
              className="text-muted-foreground hover:text-foreground h-8 w-8"
              aria-label="Clear message"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            size="icon"
            className={cn(
              'h-8 w-8 rounded-lg transition-all duration-200',
              message.trim() && !disabled
                ? 'bg-primary text-primary-foreground hover:bg-aws-orange-hover'
                : 'bg-muted text-muted-foreground'
            )}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Bottom info */}
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-xs text-muted-foreground">
          {charCount} / {maxChars}
        </span>
        <span className="text-xs text-muted-foreground hidden sm:block">
          <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">
            Cmd
          </kbd>
          {' + '}
          <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">
            Enter
          </kbd>
          {' to send'}
        </span>
      </div>
    </div>
  )
}
