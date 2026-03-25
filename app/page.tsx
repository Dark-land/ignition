'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useStore()
  const [hydrated, setHydrated] = useState(false)

  // Wait for Zustand persist to finish rehydrating from localStorage
  useEffect(() => {
    const unsubscribe = useStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })
    // If already hydrated (e.g. fast re-render), check immediately
    if (useStore.persist.hasHydrated()) {
      setHydrated(true)
    }
    return () => unsubscribe()
  }, [])
  
  useEffect(() => {
    if (!hydrated) return
    if (isAuthenticated) {
      router.replace('/chat')
    } else {
      router.replace('/login')
    }
  }, [hydrated, isAuthenticated, router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  )
}
