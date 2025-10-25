// app/layout.tsx
import '@/app/globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from "sonner";
import { SubscriptionBlockedModal } from '@/components/ui/modalPagamento';

export const metadata = {
  title: 'Gestory',
  description: 'Gerencie sua empresa com facilidade',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SubscriptionBlockedModal />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
