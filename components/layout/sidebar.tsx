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
  MessageSquare,
  BarChart3,
  ShieldAlert,
  Settings,
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
  // { name: "Faturamento", href: "/faturamento", icon: MessageSquare },
  // { name: "Análises", href: "/analises", icon: BarChart3 },
  // { name: "Registros", href: "/registros", icon: ShieldAlert },
  // { name: "Configurações", href: "/configuracoes", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r bg-background px-4 py-6 md:sticky">
      <nav className="flex flex-col gap-1">
        {links.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
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
  )
}
