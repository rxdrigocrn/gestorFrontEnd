"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
    return (
        <section className="relative z-10 py-20">
            <div className="container mx-auto px-4 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Pronto para revolucionar seu IPTV?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Junte-se a milhares de provedores que já transformaram seus negócios com nossa plataforma.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/register">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                Começar Teste Grátis
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size="lg" className="border-2 border-white text-white bg-white hover:bg-white text-blue-600 hover:text-blue-600 text-lg px-8 py-4 rounded-xl transition-all duration-300">
                            Falar com Vendas
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}