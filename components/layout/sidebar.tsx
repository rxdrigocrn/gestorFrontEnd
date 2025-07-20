"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Server,
  Smartphone,
  PackageOpen,
  FileText,
  CreditCard,
  DollarSign,
  MessageCircle,
  Globe,
} from "lucide-react"

interface SidebarLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const links: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Servidores", href: "/servidores", icon: Server },
  { name: "Dispositivos", href: "/dispositivos", icon: Smartphone },
  { name: "Aplicativos", href: "/aplicativos", icon: PackageOpen },
  { name: "Planos", href: "/planos", icon: FileText },
  { name: "Métodos de Pagamentos", href: "/metodopagamento", icon: CreditCard },
  { name: "Captações", href: "/captacao", icon: Globe },
  { name: "Cobranças", href: "/cobrancas", icon: DollarSign },
  { name: "Mensagens", href: "/mensagens", icon: MessageCircle },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()

  // Fecha a sidebar ao clicar em um link (mobile)
  const handleLinkClick = () => {
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Overlay para fechar sidebar no mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cn(
          "fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r bg-background px-4 py-6 md:sticky md:block md:translate-x-0 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-1">
          {links.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {name}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
