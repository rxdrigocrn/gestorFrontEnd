
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Check, 
  Star, 
  Users, 
  Server, 
  Shield, 
  Zap, 
  BarChart3, 
  MessageCircle, 
  CreditCard, 
  Clock, 
  Globe,
  Smartphone,
  TrendingUp,
  Award,
  PlayCircle,
  ChevronDown
} from 'lucide-react'

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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

  const testimonials = [
    {
      name: "Carlos Silva",
      company: "TechNet ISP",
      content: "Revolucionou nossa gestão. Aumentamos a eficiência em 300% e reduzimos custos operacionais significativamente.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Ana Costa",
      company: "ConnectPlus",
      content: "Interface intuitiva e recursos poderosos. Nossa equipe se adaptou rapidamente e os resultados foram imediatos.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Roberto Lima",
      company: "NetSpeed",
      content: "O melhor investimento que fizemos. O ROI foi positivo já no primeiro mês de uso da plataforma.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* <div className="absolute -top-50 -right-10 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div> */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/20 sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gestor
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">Recursos</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">Preços</a>
              <a href="#testimonials" className="text-slate-600 hover:text-blue-600 transition-colors">Depoimentos</a>
              <Link href="/auth/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="container mx-auto px-4 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Mais de 1.000 IPTVs confiam em nós
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight">
              Gerencie seu IPTV
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                com Inteligência
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              A plataforma completa para gestão de provedores de internet. 
              Automatize processos, monitore servidores e aumente sua receita.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300">
                <PlayCircle className="mr-2 w-5 h-5" />
                Ver Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Teste grátis por 14 dias
              </div>
              {/* <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Sem cartão de crédito
              </div> */}
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Suporte 24/7
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
              Recursos Poderosos
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
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
                    className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer ${
                      activeFeature === index 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-lg' 
                        : 'bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:shadow-md'
                    }`}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${
                        activeFeature === index 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'bg-slate-100 dark:bg-slate-700'
                      } transition-all duration-300`}>
                        <Icon className={`w-6 h-6 ${
                          activeFeature === index ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 dark:text-white">Dashboard Principal</h4>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Online
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">1,247</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Clientes Ativos</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">R$ 89.2k</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Receita Mensal</div>
                    </div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-end justify-between p-2">
                    {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                      <div 
                        key={i} 
                        className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-sm w-4 transition-all duration-1000 delay-100"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "10k+", label: "Clientes Atendidos" },
              { icon: Server, value: "99.9%", label: "Uptime Garantido" },
              { icon: TrendingUp, value: "300%", label: "Aumento de Eficiência" },
              { icon: Award, value: "#1", label: "Solução do Mercado" }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-slate-600 dark:text-slate-300">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular 
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
                      className={`w-full mt-6 ${
                        plan.popular 
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

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Histórias reais de IPTVs que transformaram seus negócios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-xl transition-all duration-300">
                Falar com Vendas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Gestor. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}