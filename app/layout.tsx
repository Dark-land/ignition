import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import ConfigureAmplify from '@/components/ConfigureAmplify'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'CIA - Cloud & Infrastructure Agent',
  description: 'Your intelligent AWS co-pilot for cloud infrastructure management',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0f1923',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConfigureAmplify />
          {children}
          <Toaster 
            theme="system"
            toastOptions={{
              className: 'dark:bg-[#1a2332] dark:border-[#2d3a4d] dark:text-[#e8eaed] bg-card text-foreground border-border',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
