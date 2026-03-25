'use client'

import { Menu, Globe } from 'lucide-react'
import { ModelSelector } from './model-selector'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/lib/store'

export function TopNavbar() {
  const { region, tokensUsed, maxTokens, toggleSidebar, sidebarOpen } = useStore()
  
  const tokenPercentage = (tokensUsed / maxTokens) * 100
  
  return (
    <nav className="
      h-14 px-4 flex items-center justify-between
      bg-card border-b border-border
      shrink-0
    ">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden text-muted-foreground hover:text-foreground"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {/* Desktop menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden lg:flex text-muted-foreground hover:text-foreground"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <ModelSelector />
      </div>
      
      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Region badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-muted-foreground text-xs">
          <Globe className="w-3 h-3" />
          <span>{region}</span>
        </div>
        
        {/* Token usage */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {tokensUsed.toLocaleString()} / {maxTokens.toLocaleString()}
          </span>
          <div className="w-24">
            <Progress 
              value={tokenPercentage} 
              className="h-1.5 bg-surface [&>div]:bg-primary"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
