"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Básico",
    price: "29,90",
    description: "Ideal para começar",
    features: [
      "Até 50 clientes",
      "1 servidor",
      "Suporte por email",
      "Dashboard básico",
      "Relatórios mensais"
    ],
    popular: false
  },
  {
    name: "Profissional",
    price: "59,90",
    description: "Para empresas em crescimento",
    features: [
      "Até 200 clientes",
      "3 servidores",
      "Suporte prioritário",
      "Dashboard avançado",
      "Relatórios semanais",
      "Integração WhatsApp",
      "Backup automático"
    ],
    popular: true
  },
  {
    name: "Empresarial",
    price: "99,90",
    description: "Para grandes operações",
    features: [
      "Clientes ilimitados",
      "Servidores ilimitados",
      "Suporte 24/7",
      "Dashboard personalizado",
      "Relatórios em tempo real",
      "API completa",
      "Múltiplas integrações",
      "Gerente dedicado"
    ],
    popular: false
  }
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
            Planos Transparentes
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Escolha o plano ideal para o tamanho do seu negócio. Sem taxas ocultas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${plan.popular
                ? 'border-2 border-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
                : 'border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70'
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  Mais Popular
                </div>
              )}

              <CardHeader className={plan.popular ? 'pt-12' : ''}>
                <CardTitle className="text-2xl font-bold text-center">{plan.name}</CardTitle>
                <CardDescription className="text-center">{plan.description}</CardDescription>
                <div className="text-center py-4">
                  <span className="text-4xl font-bold">R$ {plan.price}</span>
                  <span className="text-slate-600 dark:text-slate-400">/mês</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth/register" className="block">
                  <Button
                    className={`w-full mt-6 ${plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                      }`}
                    size="lg"
                  >
                    Começar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}