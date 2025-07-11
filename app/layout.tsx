// app/layout.tsx
import '@/app/globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  title: 'Gestory',
  description: 'Gerencie sua empresa com facilidade',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
