'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, AlertCircle } from 'lucide-react'
import { CIALogo } from '@/components/cia-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/lib/store'
import { signIn, getCurrentUser } from 'aws-amplify/auth'

export default function LoginPage() {
  const router = useRouter()
  const { login, setLoading, isLoading, isAuthenticated } = useStore()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Check if user is already signed in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          // If we have a user but store isn't synced, sync it
          if (!isAuthenticated) {
            login('cognito-user', user.username)
          }
          router.replace('/chat')
        }
      } catch (err) {
        // Not signed in, that's fine
      }
    }
    checkUser()
  }, [isAuthenticated, login, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsAuthenticating(true)
    setLoading(true)
    setErrorMsg('')

    try {
      // Check again if already signed in to prevent the "already signed in" error
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          router.push('/chat')
          return
        }
      } catch (e) {
        // Not signed in
      }

      // Use AWS Amplify signIn API
      const { isSignedIn, nextStep } = await signIn({
        username: formData.username,
        password: formData.password,
      })

      if (isSignedIn) {
        login('cognito-user', formData.username)
        router.push('/chat')
      } else {
        // Handle challenges like NEW_PASSWORD_REQUIRED
        if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          setErrorMsg('Please reset your temporary password via AWS Cognito.')
        } else {
          setErrorMsg(`Additional step required: ${nextStep?.signInStep}`)
        }
      }
    } catch (error: any) {
      console.error('Error signing in', error)
      setErrorMsg(error.message || 'Invalid username or password')
    } finally {
      setIsAuthenticating(false)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* External Logo / Brand Header */}
      <div className="mb-8">
        <CIALogo size="lg" isLoginPage={true} />
      </div>

      {/* Login Card */}
      <div
        className="
          w-full max-w-md p-8 md:p-10
          bg-card 
          border border-border rounded-lg shadow-sm
          animate-fade-in
        "
      >
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign In</h1>
          <p className="text-muted-foreground text-sm">Enter your AWS Cognito credentials to access the CIA Portal</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isAuthenticating ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm font-medium">
              Authenticating...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin.user"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="
                  bg-surface border-border 
                  focus:border-primary focus:ring-1 focus:ring-primary shadow-sm
                "
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
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
                  focus:border-primary focus:ring-1 focus:ring-primary shadow-sm
                "
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="
                w-full py-6 mt-2 text-base font-semibold
                bg-primary hover:bg-primary/90
                text-primary-foreground
                transition-colors duration-200
                shadow-sm btn-press
              "
              disabled={isLoading}
            >
              Sign in to Portal
            </Button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-border text-muted-foreground text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Secured communication channel</span>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
