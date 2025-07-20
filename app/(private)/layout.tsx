import '@/app/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'
import SidebarController from '@/components/layout/SidebarController'

export const metadata = {
    title: 'Gestor de Clientes',
    description: 'Gerencie seus clientes de forma eficiente e organizada.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SidebarController>
                        {children}
                    </SidebarController>
                </ThemeProvider>
            </body>
        </html>
    )
}
