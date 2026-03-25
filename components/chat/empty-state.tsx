'use client'

import { Shield, FileJson, DollarSign, AlertTriangle } from 'lucide-react'
import { CIAWatermark } from '@/components/cia-logo'

interface SuggestedPrompt {
  icon: React.ReactNode
  title: string
  prompt: string
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Audit my IAM policies',
    prompt: 'Can you audit my IAM policies and identify any security risks or overly permissive permissions?',
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'Explain this CloudFormation error',
    prompt: 'I\'m getting an error in my CloudFormation stack. Can you help me understand and fix it?',
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: 'Optimize my EC2 costs',
    prompt: 'Can you analyze my EC2 instances and suggest ways to optimize costs without affecting performance?',
  },
  {
    icon: <FileJson className="w-5 h-5" />,
    title: 'Generate Terraform config',
    prompt: 'Generate a Terraform configuration for a production-ready VPC with public and private subnets.',
  },
]

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void
}

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <CIAWatermark className="w-64 h-64 text-foreground" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Your intelligent AWS co-pilot
        </h2>
        <p className="text-muted-foreground max-w-md">
          Ask me anything about your cloud infrastructure, security, costs, or deployments.
        </p>
      </div>
      
      {/* Suggested Prompts */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestedPrompts.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(item.prompt)}
            className="
              flex items-start gap-3 p-4 rounded-xl
              bg-card border border-border
              hover:border-primary hover:bg-surface
              transition-all duration-200
              text-left group
              btn-press
            "
          >
            <div className="
              p-2 rounded-lg bg-surface
              text-primary group-hover:bg-primary group-hover:text-primary-foreground
              transition-colors duration-200
            ">
              {item.icon}
            </div>
            <span className="text-sm text-foreground font-medium">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
