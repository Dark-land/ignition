'use client'

import { ChevronDown, Cpu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'

const models = [
  { id: 'claude-sonnet', name: 'Claude Sonnet', description: 'Fast & capable' },
  { id: 'claude-opus', name: 'Claude Opus', description: 'Most powerful' },
  { id: 'claude-haiku', name: 'Claude Haiku', description: 'Fastest' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'OpenAI flagship' },
]

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useStore()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="
            gap-2 px-3 py-2 h-auto
            bg-surface hover:bg-surface-hover
            border border-border
            text-foreground
          "
        >
          <Cpu className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{selectedModel}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-56 bg-card border-border"
      >
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => setSelectedModel(model.name)}
            className="
              flex flex-col items-start gap-1 py-3 cursor-pointer
              hover:bg-surface-hover focus:bg-surface-hover
            "
          >
            <span className="font-medium text-foreground">{model.name}</span>
            <span className="text-xs text-muted-foreground">{model.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
