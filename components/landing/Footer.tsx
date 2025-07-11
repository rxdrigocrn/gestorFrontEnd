"use client"

import { Button } from "@/components/ui/button"
import { Globe, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function Footer() {
    const { theme, setTheme } = useTheme()

    return (
        <footer className="relative z-10 bg-slate-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">Gestor</span>
                        </div>
                        <p className="text-slate-400">
                            A plataforma completa para gestão de provedores de internet.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Produto</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Empresa</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Suporte</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Comunidade</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center text-center text-slate-400">
                    <p>&copy; 2024 Gestor. Todos os direitos reservados.</p>
                    {/* <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 md:mt-0 text-slate-400 hover:text-white cursor-pointer hover:bg-transparent"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        {theme === 'dark' ? (
                            <>
                                <Sun className="mr-2 h-4 w-4" />
                                Light Mode
                            </>
                        ) : (
                            <>
                                <Moon className="mr-2 h-4 w-4" />
                                Dark Mode
                            </>
                        )}
                    </Button> */}
                </div>
            </div>
        </footer>
    )
}