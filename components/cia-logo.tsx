'use client'

import { cn } from '@/lib/utils'

interface CIALogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSubtitle?: boolean
  className?: string
  dotOnly?: boolean
}

const sizeMap = {
  sm: { width: 100, subtitle: 'text-[10px]' },
  md: { width: 140, subtitle: 'text-xs' },
  lg: { width: 180, subtitle: 'text-sm' },
  xl: { width: 220, subtitle: 'text-base' },
}

export function CIALogo({ size = 'md', showSubtitle = true, className, dotOnly = false }: CIALogoProps) {
  const { width, subtitle } = sizeMap[size]

  if (dotOnly) {
    return (
      <div className={cn('rounded-full bg-primary', className)} style={{ width: width / 10, height: width / 10 }} />
    )
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-baseline">
        {/* Light Mode Logo */}
        <img
          src="https://companieslogo.com/img/orig/deloitte_BIG-86032e42.png"
          alt="Deloitte Logo"
          width={width}
          className="object-contain dark:hidden"
        />
        {/* Dark Mode Logo */}
        <img
          src="https://companieslogo.com/img/orig/deloitte_BIG.D-049d141c.png"
          alt="Deloitte Logo"
          width={width}
          className="object-contain hidden dark:block"
        />
      </div>
      {showSubtitle && (
        <span className={cn('text-muted-foreground font-medium uppercase tracking-widest mt-1.5 opacity-90', subtitle)}>
          CIA
        </span>
      )}
    </div>
  )
}

export function CIAShieldIcon({ size = 24, className }: { size?: number; className?: string }) {
  // Keeping same component name for compatibility, but rendering a green dot with CIA text
  return (
    <div
      className={cn('rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold tracking-tighter', className)}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      CIA
    </div>
  )
}

export function CIAWatermark({ className }: { className?: string }) {
  // Replaced with a subtle text watermark since we removed the shield
  return (
    <div className={cn('opacity-5 flex items-baseline gap-2', className)}>
      <span className="font-bold text-6xl tracking-tighter">Deloitte</span>
      <div className="w-4 h-4 rounded-full bg-current" />
    </div>
  )
}
