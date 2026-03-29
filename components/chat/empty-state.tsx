'use client'

import { Shield, FileJson, DollarSign, AlertTriangle } from 'lucide-react'

interface SuggestedPrompt {
  icon: React.ReactNode
  title: string
  prompt: string
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Audit security policies',
    prompt: 'Can you audit my cloud access policies and identify any security risks or overly permissive permissions?',
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'Explain deployment error',
    prompt: 'I\'m getting an error in my infrastructure deployment. Can you help me understand and fix it?',
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: 'Optimize infrastructure costs',
    prompt: 'Can you analyze my compute instances and suggest ways to optimize costs without affecting performance?',
  },
  {
    icon: <FileJson className="w-5 h-5" />,
    title: 'Generate IaC config',
    prompt: 'Generate a Terraform configuration for a production-ready VPC with public and private subnets.',
  },
]

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void
}

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
      {/* Content */}
      <div className="text-center mb-10 max-w-lg">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Your cloud infrastructure copilot
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Ask me anything about your cloud infrastructure, security posture, cost optimization, or deployment troubleshooting.
        </p>
      </div>
      
      {/* Suggested Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {suggestedPrompts.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(item.prompt)}
            className="
              flex flex-col gap-3 p-5 rounded-lg
              bg-card border border-border shadow-sm
              hover:border-primary hover:shadow-md
              transition-all duration-200
              text-left group
              btn-press
            "
          >
            <div className="
              flex items-center gap-3
            ">
              <div className="
                p-2 rounded bg-surface text-foreground
                group-hover:bg-primary group-hover:text-primary-foreground
                transition-colors duration-200
              ">
                {item.icon}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {item.title}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

