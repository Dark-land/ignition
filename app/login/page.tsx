'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'
import { CIALogo } from '@/components/cia-logo'
import { ParticleBackground } from '@/components/particle-background'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { login, setLoading, isLoading } = useStore()
  
  const [formData, setFormData] = useState({
    accountId: '',
    username: '',
    password: '',
  })
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsAuthenticating(true)
    setLoading(true)
    
    // Simulate IAM authentication (accept any input for demo)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Use provided values or fallback to mock data
    const accountId = formData.accountId || '123456789012'
    const username = formData.username || 'demo.user'
    
    login(accountId, username)
    router.push('/chat')
  }
  
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-radial-glow" />
      <ParticleBackground />
      
      {/* Login Card */}
      <div 
        className={`
          relative z-10 w-full max-w-md mx-4 p-8 
          bg-card/90 backdrop-blur-sm 
          border border-border rounded-xl
          animate-fade-in
        `}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <CIALogo size="lg" />
        </div>
        
        {isAuthenticating ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm">
              Authenticating with AWS IAM...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* AWS Account ID */}
            <div className="space-y-2">
              <Label htmlFor="accountId" className="text-foreground">
                AWS Account ID
              </Label>
              <Input
                id="accountId"
                type="text"
                placeholder="123456789012"
                value={formData.accountId}
                onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                className="
                  bg-surface border-border 
                  focus:border-primary focus:ring-2 focus:ring-primary/30
                  placeholder:text-muted-foreground/50
                "
              />
            </div>
            
            {/* IAM Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                IAM Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin.user"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="
                  bg-surface border-border 
                  focus:border-primary focus:ring-2 focus:ring-primary/30
                  placeholder:text-muted-foreground/50
                "
              />
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="
                  bg-surface border-border 
                  focus:border-primary focus:ring-2 focus:ring-primary/30
                  placeholder:text-muted-foreground/50
                "
              />
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="
                w-full py-6 text-base font-semibold
                bg-gradient-to-r from-primary to-aws-orange-hover
                hover:from-aws-orange-hover hover:to-primary
                text-primary-foreground
                transition-all duration-300
                animate-glow
                btn-press
              "
              disabled={isLoading}
            >
              Sign in with IAM
            </Button>
            
            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Lock className="w-4 h-4" />
              <span>Secured by AWS IAM</span>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
