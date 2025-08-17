"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function Navbar() {
    return (
        <nav className="relative z-50 bg-white/80   backdrop-blur-md border-b border-white/20 sticky top-0">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-lime-300 to-green-600 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-lime-300 to-green-600 bg-clip-text text-transparent">
                            Gestor
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <a href="#features" className="text-slate-600   hover:text-lime-700 transition-colors">
                            Recursos
                        </a>
                        <a href="#pricing" className="text-slate-600   hover:text-lime-700 transition-colors">
                            Preços
                        </a>
                        <a href="#testimonials" className="text-slate-600   hover:text-lime-700 transition-colors">
                            Depoimentos
                        </a>
                        <Link href="/auth/login">
                            <Button variant="link" size="lg" className="bg-white border-slate-200 text-slate-900 hover:bg-slate-100">Entrar</Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button className="bg-gradient-to-r text-white from-lime-300 to-green-600 hover:from-lime-400   hover:to-green-700">
                                Começar Grátis
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}