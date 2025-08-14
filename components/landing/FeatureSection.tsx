"use client"

import { useState } from "react"
import { Users, Server, BarChart3, TrendingUp, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Users,
    title: "Gestão Completa de Clientes",
    description: "Controle total sobre sua base de clientes com informações detalhadas, histórico de pagamentos e comunicação integrada."
  },
  {
    icon: Server,
    title: "Monitoramento de Servidores",
    description: "Acompanhe a performance dos seus servidores em tempo real com alertas automáticos e relatórios detalhados."
  },
  {
    icon: BarChart3,
    title: "Analytics Avançado",
    description: "Dashboards intuitivos com métricas importantes para tomar decisões estratégicas baseadas em dados."
  }
]

const stats = [
  { icon: Users, value: "10k+", label: "Clientes Atendidos" },
  { icon: Server, value: "99.9%", label: "Uptime Garantido" },
  { icon: TrendingUp, value: "300%", label: "Aumento de Eficiência" },
  { icon: Award, value: "#1", label: "Solução do Mercado" }
]

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <section id="features" className="relative z-10 py-20 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-lime-300 to-green-600 bg-clip-text text-transparent">
            Recursos Poderosos
          </h2>
          <p className="text-xl text-slate-600  max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar seu IPTV de forma eficiente e profissional
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer ${activeFeature === index
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50  border-2 border-blue-200  shadow-lg'
                    : 'bg-white/70   border border-slate-200  hover:shadow-md'
                    }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${activeFeature === index
                      ? 'bg-gradient-to-r from-lime-300 to-green-600'
                      : 'bg-slate-100  '
                      } transition-all duration-300`}>
                      <Icon className={`w-6 h-6 ${activeFeature === index ? 'text-white' : 'text-slate-600 '
                        }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-900 ">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-lime-300 to-green-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white  rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 ">Dashboard Principal</h4>
                  <Badge className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50  rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-slate-600 ">Clientes Ativos</div>
                  </div>
                  <div className="bg-slate-50  rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">R$ 89.2k</div>
                    <div className="text-sm text-slate-600 ">Receita Mensal</div>
                  </div>
                </div>
                <div className="h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-end justify-between p-2">
                  {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-lime-300 to-green-600 rounded-sm w-4 transition-all duration-1000 delay-100"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-lime-300 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900  mb-2">{stat.value}</div>
                <div className="text-slate-600  ">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}