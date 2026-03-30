'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, AlertCircle } from 'lucide-react'
import { CIALogo } from '@/components/cia-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/lib/store'
import { signIn, getCurrentUser, confirmSignIn } from 'aws-amplify/auth'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'


export default function LoginPage() {
  const router = useRouter()
  const { login, setLoading, isLoading, isAuthenticated } = useStore()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [signInStep, setSignInStep] = useState<'SIGN_IN' | 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'>('SIGN_IN')
  const [mfaCode, setMfaCode] = useState('')

  // Check for disclaimer on mount
  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('cia_disclaimer_seen')
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true)
    }
  }, [])

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('cia_disclaimer_seen', 'true')
    setShowDisclaimer(false)
  }


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
      if (signInStep === 'SIGN_IN') {
        const { isSignedIn, nextStep } = await signIn({
          username: formData.username,
          password: formData.password,
        })

        if (isSignedIn) {
          login('cognito-user', formData.username)
          router.push('/chat')
        } else {
          if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
            setSignInStep('CONFIRM_SIGN_IN_WITH_TOTP_CODE')
          } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
            setErrorMsg('Please reset your temporary password via AWS Cognito.')
          } else {
            setErrorMsg(`Additional step required: ${nextStep?.signInStep}`)
          }
        }
      } else if (signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
        const { isSignedIn } = await confirmSignIn({
          challengeResponse: mfaCode,
        })

        if (isSignedIn) {
          login('cognito-user', formData.username)
          router.push('/chat')
        }
      }
    } catch (error: any) {
      console.error('Error during authentication', error)
      setErrorMsg(error.message || 'Authentication failed')
      // Reset to SIGN_IN if error happens during MFA
      if (signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
        setSignInStep('SIGN_IN')
        setMfaCode('')
      }
    } finally {
      setIsAuthenticating(false)
      setLoading(false)
    }

  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background elements for premium feel */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* Privacy Disclaimer Dialog */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="sm:max-w-[425px] border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Private Access Only
            </DialogTitle>
            <DialogDescription className="pt-2 text-muted-foreground leading-relaxed">
              This system contains proprietary and confidential information. 
              Unauthorized access, use, or disclosure is strictly prohibited. 
              By proceeding, you acknowledge that this platform is intended 
              strictly for authorized personnel.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-xs text-muted-foreground bg-surface p-3 rounded-lg border border-border">
              All activities on this system are logged and monitored for security purposes.
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleAcceptDisclaimer}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4"
            >
              I Acknowledge & Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {signInStep === 'SIGN_IN' ? 'Portal Access' : 'Security Verification'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {signInStep === 'SIGN_IN' 
              ? 'Enter your AWS Cognito credentials to access the CIA Portal' 
              : 'Enter the 6-digit code from your authenticator app'}
          </p>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {signInStep === 'SIGN_IN' ? (
              <>
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
                      bg-surface border-border h-11
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
                      bg-surface border-border h-11
                      focus:border-primary focus:ring-1 focus:ring-primary shadow-sm
                    "
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4 flex flex-col items-center">
                <Label className="text-foreground font-medium self-start">
                  Authenticator Code
                </Label>
                <div className="py-2">
                  <InputOTP
                    maxLength={6}
                    value={mfaCode}
                    onChange={(value) => setMfaCode(value)}
                    onComplete={() => {
                      // Trigger submit automatically on complete if desired
                    }}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="w-12 h-14 text-lg border-border bg-surface" />
                      <InputOTPSlot index={1} className="w-12 h-14 text-lg border-border bg-surface" />
                      <InputOTPSlot index={2} className="w-12 h-14 text-lg border-border bg-surface" />
                      <InputOTPSlot index={3} className="w-12 h-14 text-lg border-border bg-surface" />
                      <InputOTPSlot index={4} className="w-12 h-14 text-lg border-border bg-surface" />
                      <InputOTPSlot index={5} className="w-12 h-14 text-lg border-border bg-surface" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSignInStep('SIGN_IN')
                    setMfaCode('')
                  }}
                  className="text-primary hover:text-primary/80 text-xs font-medium"
                >
                  Back to Login
                </Button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="
                w-full py-7 text-base font-bold
                bg-primary hover:bg-primary/90
                text-primary-foreground
                transition-all duration-200
                shadow-md hover:shadow-lg active:scale-[0.98]
              "
              disabled={isLoading || (signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' && mfaCode.length < 6)}
            >
              {signInStep === 'SIGN_IN' ? 'Sign in to Portal' : 'Verify Identity'}
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
