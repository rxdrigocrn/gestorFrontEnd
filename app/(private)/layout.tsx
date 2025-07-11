import '@/app/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="relative flex min-h-screen flex-col">
                        <Header />
                        <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-4 sm:p-6 w-full max-w-[100vw] overflow-x-hidden">
                                {children}
                            </main>
                        </div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}
export const metadata = {
    title: 'Gestor de Clientes',
    description: 'Gerencie seus clientes de forma eficiente e organizada.',
}