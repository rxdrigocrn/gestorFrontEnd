'use client'

import React, { useEffect, useState } from 'react'
import { useSaasPlanStore } from '@/store/saasPlanStore'
import { Button } from '@/components/ui/button'
import { SkeletonTable } from '@/components/ui/table-skeleton'
import { PlanCard } from '@/components/subscription/SaasPlanCard'
import { ZapIcon, CreditCardIcon, QrCodeIcon } from 'lucide-react'
import { PaymentMethod } from '@/types/billings'
import { useSimpleToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

const SubscriptionPage = () => {
  const { items, isLoading, fetchItems, handleCheckout } = useSaasPlanStore()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD')
  const [isProcessing, setIsProcessing] = useState(false)
  const { showToast } = useSimpleToast()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const plans = items?.length > 0 ? items : [
    {
      id: '1',
      name: 'Básico',
      price: 29,
      popular: false,
      features: [
        'Até 5 projetos',
        '3GB de armazenamento',
        'Suporte por email',
        'Acesso básico aos recursos'
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Profissional',
      price: 79,
      popular: true,
      features: [
        'Projetos ilimitados',
        '50GB de armazenamento',
        'Suporte prioritário 24/7',
        'Recursos avançados',
        'Relatórios detalhados'
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Empresarial',
      price: 159,
      popular: false,
      features: [
        'Projetos ilimitados',
        '500GB de armazenamento',
        'Suporte dedicado',
        'Todos os recursos',
        'API acesso',
        'SSO integrado'
      ],
      createdAt: new Date().toISOString(),
    },
  ]

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleGoToCheckout = async () => {
    if (!selectedPlan) {
      showToast('error', 'Selecione um plano', {
        description: 'Escolha um plano antes de continuar',
      })
      return
    }
 

    setIsProcessing(true)
    try {
      await handleCheckout(selectedPlan, paymentMethod)
      showToast('success', 'Redirecionando para pagamento', {
        description: 'Você será redirecionado para finalizar sua compra',
      })
    } catch (error) {
      console.error('Erro ao ir para o checkout:', error)
      showToast('error', 'Erro no checkout', {
        description: 'Tente novamente ou entre em contato com o suporte',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) return <SkeletonTable rows={0} columns={0} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9e6] to-emerald-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-lime-100 text-emerald-800 hover:bg-lime-200 border-0">
            Escolha o melhor para você
          </Badge>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl mb-4">
            Planos{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-lime-400 bg-clip-text text-transparent">
              Mensais
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comece gratuitamente e faça upgrade conforme sua empresa cresce.
            Todos os planos incluem nossos recursos essenciais.
          </p>
        </div>

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              popular={plan.popular}
              billingInterval="month"
              onSelect={() => handleSelectPlan(plan.id)}
              selected={selectedPlan === plan.id}
            />
          ))}
        </div>

        {/* Métodos de Pagamento */}
        {selectedPlan && (
          <div className="max-w-md mx-auto mb-12">
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-6">
              Escolha como pagar
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={paymentMethod === 'CARD' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('CARD')}
                className={`h-16 flex-col gap-2 ${paymentMethod === 'CARD'
                  ? 'bg-lime-500 text-white'
                  : 'border-lime-500 text-emerald-700 hover:bg-emerald-50'
                  }`}
              >
                <CreditCardIcon className="w-5 h-5" />
                <span>Cartão</span>
              </Button>
              <Button
                variant={paymentMethod === 'PIX' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('PIX')}
                className={`h-16 flex-col gap-2 ${paymentMethod === 'PIX'
                  ? 'bg-lime-500 text-white'
                  : 'border-lime-500 text-emerald-700 hover:bg-emerald-50'
                  }`}
              >
                <QrCodeIcon className="w-5 h-5" />
                <span>PIX</span>
              </Button>
            </div>
          </div>
        )}

        {/* Checkout */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleGoToCheckout}
            disabled={!selectedPlan || isProcessing}
            className={`
              px-16 py-6 text-lg font-semibold shadow-lg transition-all duration-200
              transform hover:scale-105 disabled:transform-none disabled:hover:scale-100
              ${selectedPlan
                ? 'bg-gradient-to-r from-emerald-600 to-lime-400 hover:from-emerald-700 hover:to-lime-500 text-white'
                : 'bg-gray-400'
              }
            `}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ZapIcon className="w-5 h-5" />
                {selectedPlan ? 'Continuar para Pagamento' : 'Selecione um Plano'}
              </span>
            )}
          </Button>

          {!selectedPlan && (
            <p className="text-gray-500 mt-4 text-sm">
              ⬆️ Selecione um plano acima para continuar
            </p>
          )}
        </div>

        {/* Garantia */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            ✅ Garantia de 30 dias ou seu dinheiro de volta
          </p>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage
