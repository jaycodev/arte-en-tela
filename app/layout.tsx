import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'

import { StoreProvider } from '@/components/shared/store-provider'
import { ThemeScript } from '@/components/shared/theme-script'
import { CanvasProvider } from '@/lib/hooks/useCanvas'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Arte en Tela - Diseña tu Polo',
  description: '',
  icons: {
    icon: [{ url: '/icons/favicon.svg', type: 'image/svg+xml' }],
  },
}

export function generateViewport() {
  return {
    themeColor: [{ color: 'oklch(1 0 0)' }],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableColorScheme
        >
          <StoreProvider>
            <CanvasProvider>
              <NextTopLoader
                color="var(--primary)"
                height={2}
                easing="linear"
                showSpinner={false}
              />
              {children}
            </CanvasProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
