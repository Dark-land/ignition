'use client'

import { MessageSquarePlus, Settings, LogOut, Trash2 } from 'lucide-react'
import { CIALogo } from '@/components/cia-logo'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { signOut } from 'aws-amplify/auth'
import { ThemeToggle } from '@/components/theme-toggle'

export function Sidebar() {
  const router = useRouter()
  const {
    user,
    conversations,
    currentConversationId,
    createConversation,
    deleteConversation,
    setCurrentConversation,
    logout,
    sidebarOpen,
  } = useStore()
  
  const handleNewChat = () => {
    createConversation()
  }
  
  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out of Cognito:', error)
    } finally {
      logout()
      router.push('/login')
    }
  }
  
  if (!sidebarOpen) return null
  
  return (
    <aside className="
      w-[260px] h-screen flex flex-col
      bg-sidebar border-r border-sidebar-border
      shrink-0
    ">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <CIALogo size="sm" showSubtitle={true} />
      </div>
      
      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
              {user.initials}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium leading-none mb-1 text-white">{user.username}</span>
              <span className="text-xs text-white/70 leading-none">AWS Authenticated</span>
            </div>
          </div>
        </div>
      )}
      
      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          variant="default" // Using default (primary) rather than outline
          className="
            w-full justify-start gap-2
            bg-primary text-primary-foreground
            hover:bg-primary/90
            transition-colors duration-200
            shadow-sm font-semibold
          "
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Chat
        </Button>
      </div>
      
      {/* Conversation History */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                'group relative flex items-center rounded-lg px-3 py-2 cursor-pointer transition-all duration-200',
                currentConversationId === conv.id
                  ? 'bg-sidebar-accent border-l-2 border-primary'
                  : 'hover:bg-sidebar-accent/50'
              )}
              onClick={() => setCurrentConversation(conv.id)}
            >
              <span className="flex-1 truncate text-sm text-sidebar-foreground">
                {conv.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(conv.id)
                }}
                className="
                  flex shrink-0
                  opacity-100 sm:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100
                  p-1 rounded hover:bg-destructive/20
                  transition-all duration-200
                "
                aria-label="Delete conversation"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))}
          
          {conversations.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No conversations yet
            </p>
          )}
        </div>
      </ScrollArea>
      
      {/* Footer Actions */}
      <div className="p-4 border-t border-sidebar-border flex gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </aside>
  )
}
