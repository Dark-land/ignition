import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
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
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster 
          theme="dark"
          toastOptions={{
            style: {
              background: '#1a2332',
              border: '1px solid #2d3a4d',
              color: '#e8eaed',
            },
          }}
        />
      </body>
    </html>
  )
}
