// app/layout.tsx
import '@/app/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Gestor IPTV',
  description: 'Gerencie seu IPTV com facilidade',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}
