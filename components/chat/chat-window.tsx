'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { ArrowDown } from 'lucide-react'
import { MessageBubble, StreamingIndicator } from './message-bubble'
import { EmptyState } from './empty-state'
import { ChatInput } from './chat-input'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { sendMessageToAPI } from '@/lib/api-config'
import { cn } from '@/lib/utils'

export function ChatWindow() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  
  const {
    user,
    conversations,
    currentConversationId,
    addMessage,
    createConversation,
    updateConversationSessionId,
  } = useStore()
  
  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const messages = currentConversation?.messages ?? []
  
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])
  
  // Auto scroll on new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])
  
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }
  }
  
  const handleSendMessage = async (content: string, password?: string) => {
    let conversationId = currentConversationId
    let requestSessionId = currentConversation?.sessionId
    
    // Create conversation if none exists
    if (!conversationId) {
      conversationId = createConversation()
      requestSessionId = undefined // New chat shouldn't have one
    }
    
    // Add user message
    addMessage(conversationId, { role: 'user', content })
    
    // Call the API
    setIsStreaming(true)
    
    try {
      const response = await sendMessageToAPI(content, requestSessionId, password)
      // Persist the session_id returned by the API to this specific conversation
      if (response.sessionId && (!currentConversation || currentConversation.sessionId !== response.sessionId)) {
        updateConversationSessionId(conversationId, response.sessionId)
      }
      addMessage(conversationId, { role: 'assistant', content: response.text })
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred'
      addMessage(conversationId, { 
        role: 'assistant', 
        content: `**Error:** ${errorMessage}\n\nPlease check your API configuration in \`lib/api-config.ts\` or set the \`NEXT_PUBLIC_CIA_API_URL\` environment variable.` 
      })
    } finally {
      setIsStreaming(false)
    }
  }
  
  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {messages.length === 0 && !isStreaming ? (
        <EmptyState onSelectPrompt={handleSelectPrompt} />
      ) : (
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-4 space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                userInitials={user?.initials}
              />
            ))}
            
            {isStreaming && <StreamingIndicator />}
          </div>
        </div>
      )}
      
      {/* Scroll to bottom button */}
      <div className={cn(
        'absolute bottom-24 right-6 transition-all duration-200',
        showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="rounded-full bg-card border border-border hover:bg-surface shadow-lg"
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isStreaming}
      />
    </div>
  )
}
