'use client'

import { cn } from '@/lib/utils'

interface CIALogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSubtitle?: boolean
  className?: string
}

const sizeMap = {
  sm: { shield: 32, text: 'text-lg', subtitle: 'text-[10px]' },
  md: { shield: 48, text: 'text-2xl', subtitle: 'text-xs' },
  lg: { shield: 64, text: 'text-3xl', subtitle: 'text-sm' },
  xl: { shield: 80, text: 'text-4xl', subtitle: 'text-base' },
}

export function CIALogo({ size = 'md', showSubtitle = true, className }: CIALogoProps) {
  const { shield, text, subtitle } = sizeMap[size]
  
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Shield with terminal prompt icon */}
      <div 
        className="relative flex items-center justify-center"
        style={{ width: shield, height: shield }}
      >
        <svg
          viewBox="0 0 40 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Shield outline */}
          <path
            d="M20 2L4 8V20C4 31.05 10.74 41.13 20 44C29.26 41.13 36 31.05 36 20V8L20 2Z"
            fill="#1a2332"
            stroke="#ff9900"
            strokeWidth="2"
          />
          {/* Inner shield gradient */}
          <path
            d="M20 5L7 10V20C7 29.44 12.64 38.02 20 40.8C27.36 38.02 33 29.44 33 20V10L20 5Z"
            fill="url(#shieldGradient)"
          />
          {/* Terminal prompt >_ */}
          <text
            x="20"
            y="26"
            textAnchor="middle"
            fill="#ff9900"
            fontFamily="monospace"
            fontSize="14"
            fontWeight="bold"
          >
            {'>_'}
          </text>
          <defs>
            <linearGradient id="shieldGradient" x1="20" y1="5" x2="20" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#232f3e" />
              <stop offset="100%" stopColor="#1a2332" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className={cn('font-bold text-foreground tracking-tight', text)}>
          CIA
        </span>
        {showSubtitle && (
          <span className={cn('text-muted-foreground tracking-wide', subtitle)}>
            Cloud & Infrastructure Agent
          </span>
        )}
      </div>
    </div>
  )
}

export function CIAShieldIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 1.1}
      className={className}
    >
      <path
        d="M20 2L4 8V20C4 31.05 10.74 41.13 20 44C29.26 41.13 36 31.05 36 20V8L20 2Z"
        fill="#1a2332"
        stroke="#ff9900"
        strokeWidth="2"
      />
      <path
        d="M20 5L7 10V20C7 29.44 12.64 38.02 20 40.8C27.36 38.02 33 29.44 33 20V10L20 5Z"
        fill="url(#shieldGradientSmall)"
      />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fill="#ff9900"
        fontFamily="monospace"
        fontSize="14"
        fontWeight="bold"
      >
        {'>_'}
      </text>
      <defs>
        <linearGradient id="shieldGradientSmall" x1="20" y1="5" x2="20" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#232f3e" />
          <stop offset="100%" stopColor="#1a2332" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function CIAWatermark({ className }: { className?: string }) {
  return (
    <div className={cn('opacity-5', className)}>
      <svg
        viewBox="0 0 40 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M20 2L4 8V20C4 31.05 10.74 41.13 20 44C29.26 41.13 36 31.05 36 20V8L20 2Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="monospace"
          fontSize="14"
          fontWeight="bold"
        >
          {'>_'}
        </text>
      </svg>
    </div>
  )
}
