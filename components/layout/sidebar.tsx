"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Server,
  CreditCard,
  PackageOpen,
  Settings,
  BarChart3,
  MessageSquare,
  ShieldAlert,
  FileText,
  Smartphone,
  DollarSign,
  MessageCircle
} from 'lucide-react'

interface SidebarLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mainLinks: SidebarLink[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard
  },
  {
    name: 'Clientes',
    href: '/clientes',
    icon: Users
  },
  {
    name: 'Servidores',
    href: '/servidores',
    icon: Server
  },
  {
    name: 'Dispositivos',
    href: '/devices',
    icon: Smartphone
  },
  {
    name: 'Aplicativos',
    href: '/applications',
    icon: PackageOpen
  },
  {
    name: 'Planos',
    href: '/plans',
    icon: FileText
  },
  {
    name: 'Pagamentos',
    href: '/payments',
    icon: CreditCard
  },
  {
    name: 'Cobranças',
    href: '/cobrancas',
    icon: DollarSign
  },
  {
    name: 'Mensagens',
    href: '/mensagens',
    icon: MessageCircle
  },
  {
    name: 'Faturamento',
    href: '/billing',
    icon: MessageSquare
  },
  {
    name: 'Análises',
    href: '/analytics',
    icon: BarChart3
  },
  {
    name: 'Registros',
    href: '/logs',
    icon: ShieldAlert
  },
  {
    name: 'Configurações',
    href: '/settings',
    icon: Settings
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r bg-background transition-transform duration-200 md:sticky md:translate-x-0">
      <nav className="flex h-full flex-col py-6 pr-2 pl-4">
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                pathname === link.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  )
}