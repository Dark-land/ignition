'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Paperclip, X, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string, password?: string) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
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
      onSendMessage(message.trim(), password || undefined)
      setMessage('')
      setPassword('')
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }
  
  const charCount = message.length
  const maxChars = 4000
  
  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="flex flex-col gap-3">
        <div className="
          flex flex-col gap-2 p-3 rounded-xl
          bg-surface border border-border
          focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm
          transition-all duration-200
        ">
          <div className="flex items-end gap-2">
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
            
            <div className="flex items-center gap-1 shrink-0">
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
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                    : 'bg-muted text-muted-foreground'
                )}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center pt-2 mt-1 border-t border-border/50 gap-2">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Action password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={disabled}
              className="h-7 text-xs bg-transparent border-none shadow-none focus-visible:ring-0 px-1 py-0 placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
        
        {/* Bottom info */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">
            {charCount} / {maxChars}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">
              Enter
            </kbd>
            {' to send • '}
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">
              Shift
            </kbd>
            {' + '}
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">
              Enter
            </kbd>
            {' for new line'}
          </span>
        </div>
      </div>
    </div>
  )
}

