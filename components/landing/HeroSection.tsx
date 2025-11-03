"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, PlayCircle, Star, ChevronDown } from "lucide-react"

interface HeroSectionProps {
    isVisible: boolean
}

export function HeroSection({ isVisible }: HeroSectionProps) {
    return (
        <section className="relative z-10 pt-20 pb-32">
            <div className="container mx-auto px-4 text-center">
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <Badge className="mb-6 bg-gradient-to-r from-lime-300 to-green-600 text-white border-0 px-4 py-2">
                        <Star className="w-4 h-4 mr-2" />
                        Mais de 1.000 IPTVs confiam em nós
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-lime-400 to-green-900 bg-clip-text text-transparent leading-tight">
                        Gerencie seu IPTV
                        <br />
                        <span className="bg-gradient-to-r from-lime-400 to-green-600 bg-clip-text text-transparent">
                            com Inteligência
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                        A plataforma completa para gestão de provedores de internet.
                        Automatize processos, monitore servidores e aumente sua receita.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link href="/registro">
                            <Button size="lg" className="bg-gradient-to-r text-white from-lime-300 to-green-600 hover:from-lime-400 hover:to-green-700 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                Começar Gratuitamente
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size="lg" className="text-lg px-8 py-4 rounded-xl border-2 bg-white border-slate-200 text-slate-900 hover:bg-slate-100 transition-all duration-300">
                            <PlayCircle className="mr-2 w-5 h-5" />
                            Ver Demo
                        </Button>
                    </div>

                    <div className="flex items-center justify-center space-x-8 text-sm text-slate-500 ">
                        <div className="flex items-center">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            Teste grátis por 14 dias
                        </div>
                        <div className="flex items-center">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            Suporte 24/7
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <ChevronDown className="w-6 h-6 text-slate-400" />
            </div>
        </section>
    )
}