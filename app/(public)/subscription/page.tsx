'use client'
import React, { useEffect, useState } from 'react'
import { useSaasPlanStore } from '@/store/saasPlanStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SkeletonTable } from '@/components/ui/table-skeleton'
import { SaaSPlanResponse } from '@/types/saasPlan'
import { CheckIcon, StarIcon, ZapIcon } from 'lucide-react'

const SubscriptionPage = () => {
  const { items, isLoading, fetchItems } = useSaasPlanStore()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')

  useEffect(() => {
    fetchItems()
  }, [])

  const mockPlans: SaaSPlanResponse[] = [
    {
      id: '1',
      name: 'Básico',
      price: 29,
      interval: 'month',
      features: [
        'Até 5 projetos',
        '3GB de armazenamento',
        'Suporte por email',
        'Relatórios básicos',
        'Até 3 usuários'
      ]
    },
    {
      id: '2',
      name: 'Profissional',
      price: 79,
      interval: 'month',
      popular: true,
      features: [
        'Projetos ilimitados',
        '50GB de armazenamento',
        'Suporte prioritário',
        'Relatórios avançados',
        'Até 15 usuários',
        'API access',
        'White-label'
      ]
    },
    {
      id: '3',
      name: 'Empresarial',
      price: 199,
      interval: 'month',
      features: [
        'Projetos ilimitados',
        '500GB de armazenamento',
        'Suporte 24/7',
        'Relatórios customizados',
        'Usuários ilimitados',
        'API access',
        'White-label',
        'SSO',
        'Onboarding dedicado'
      ]
    }
  ]

  const plans = items.length > 0 ? items : mockPlans

  const getYearlyPrice = (monthlyPrice: number) => Math.floor(monthlyPrice * 12 * 0.8)

  const handleSelectPlan = (planId: string) => setSelectedPlan(planId)

  const handleCheckout = () => {
    if (selectedPlan) {
      console.log('Indo para checkout com plano:', selectedPlan)
    }
  }

  if (isLoading) return <SkeletonTable rows={0} columns={0} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl lg:text-6xl mb-4">
            Escolha seu{" "}
            <span className="bg-gradient-to-t from-emerald-600 to-lime-300 bg-clip-text  text-transparent">
              Plano
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comece agora mesmo e evolua conforme suas necessidades. Todos os planos incluem nossos recursos essenciais.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-card border rounded-xl p-1 shadow-sm flex items-center space-x-2">
            {(['month', 'year'] as const).map((interval) => {
              const isSelected = billingInterval === interval;
              const isYear = interval === 'year';

              return (
                <button
                  key={interval}
                  onClick={() => setBillingInterval(interval)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2
          ${isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {isYear ? (
                    <>
                      <span>Anual</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs transition-colors duration-200
                ${isSelected
                            ? 'bg-primary-foreground/20 text-white'
                            : 'bg-accent/20 text-accent'
                          }`}
                      >
                        -20%
                      </Badge>
                    </>
                  ) : (
                    'Mensal'
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={handleSelectPlan}
              billingInterval={billingInterval}
              getYearlyPrice={getYearlyPrice}
            />
          ))}
        </div>

        {/* Checkout Button */}
        <div className="text-center mt-14">
          <Button
            size="lg"
            onClick={handleCheckout}
            disabled={!selectedPlan}
            className="px-12 py-6 text-lg font-semibold bg-primary hover:bg-accent text-primary-foreground shadow-md transition-all"
          >
            <ZapIcon className="w-5 h-5 mr-2" />
            Continuar para Checkout
          </Button>
          {!selectedPlan && (
            <p className="text-muted-foreground mt-4">Selecione um plano para continuar</p>
          )}
        </div>
      </div>
    </div>
  )
}

const PlanCard = ({
  plan,
  isSelected,
  onSelect,
  billingInterval,
  getYearlyPrice
}: {
  plan: SaaSPlanResponse
  isSelected: boolean
  onSelect: (id: string) => void
  billingInterval: 'month' | 'year'
  getYearlyPrice: (price: number) => number
}) => {
  const price = billingInterval === 'month' ? plan.price : getYearlyPrice(plan.price)
  const originalPrice = billingInterval === 'year' ? plan.price * 12 : null

  return (
    <Card
      // 👇 ALTERAÇÃO AQUI: Adicionado flex, flex-col e h-full
      className={`relative flex flex-col h-full transition-all duration-300 hover:scale-[1.03] ${isSelected
        ? 'ring-2 ring-primary shadow-lg border-primary'
        : 'hover:shadow-md border-border'
        } ${plan.popular ? 'border-accent/60' : ''}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-accent text-accent-foreground px-4 py-1 font-semibold flex items-center gap-1">
            <StarIcon className="w-3 h-3 fill-current" />
            Mais Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
        <CardDescription className="text-muted-foreground mt-2">
          {plan.description || `Plano ideal para ${plan.name.toLowerCase()}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold text-foreground">R$ {price}</span>
            <span className="text-muted-foreground">
              /{billingInterval === 'month' ? 'mês' : 'ano'}
            </span>
          </div>
          {originalPrice && (
            <p className="text-sm text-muted-foreground line-through mt-1">R$ {originalPrice}</p>
          )}
        </div>

        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-accent" />
              </div>
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto pt-6">
        <Button
          onClick={() => onSelect(plan.id)}
          variant={isSelected ? 'default' : 'outline'}
          className={`w-full py-5 text-lg font-semibold transition-all ${isSelected
            ? 'bg-primary  hover:bg-accent'
            : 'border-accent hover:text-primary   hover:bg-accent/10'
            }`}
        >
          {isSelected ? 'Selecionado' : 'Selecionar Plano'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SubscriptionPage
