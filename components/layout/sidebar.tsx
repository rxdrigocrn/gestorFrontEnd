"use client"

import { useState } from "react"
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
  UserCog,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Usuários", href: "/usuarios", icon: UserCog },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Servidores", href: "/servidores", icon: Server },
  { name: "Dispositivos", href: "/dispositivos", icon: Smartphone },
  { name: "Aplicativos", href: "/aplicativos", icon: PackageOpen },
  { name: "Planos", href: "/planos", icon: FileText },
  { name: "Métodos de Pagamentos", href: "/metodopagamento", icon: CreditCard },
  { name: "Captações", href: "/captacao", icon: Globe },
  { name: "Cobranças", href: "/cobrancas", icon: DollarSign },
  { name: "Mensagens", href: "/mensagens", icon: MessageCircle },
  { name: "Pagamentos", href: "/pagamentos", icon: CircleDollarSign },
  { name: "Histórico", href: "/logs", icon: FileText },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Overlay Mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-20 md:hidden transition-opacity duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cn(
          "fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] border-r bg-card transition-all duration-300 ease-in-out md:sticky",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-[78px]" : "w-64"
        )}
      >
        <div className="flex h-full flex-col justify-between py-4">
          {/* Menu de Links */}
          <nav className="flex flex-col gap-1 px-3">
            {links.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group relative flex items-center h-10 rounded-lg transition-all duration-200 hover:bg-accent",
                    isActive ? "bg-accent text-white" : "text-muted-foreground",
                    isCollapsed ? "justify-center px-0" : "px-3"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0 transition-transform", isActive && "scale-110")} />

                  <span
                    className={cn(
                      "ml-3 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out text-sm font-medium",
                      isCollapsed ? "w-0 opacity-0 ml-0" : "w-full opacity-100"
                    )}
                  >
                    {name}
                  </span>

                  {/* Tooltip simples quando fechado */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border">
                      {name}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Botão de Recolher/Expandir */}
          <div className="px-3 mt-auto pt-4 border-t border-border/50">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "flex items-center w-full h-10 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200",
                isCollapsed ? "justify-center px-0" : "px-3"
              )}
            >
              <div className={cn("flex items-center transition-all", isCollapsed ? "flex-col" : "flex-row gap-3")}>
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <>
                    <ChevronLeft className="h-5 w-5" />
                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
                      Recolher menu
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}