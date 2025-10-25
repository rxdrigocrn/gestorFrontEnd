'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSaasPlanStore } from '@/store/saasPlanStore'
import { useSubscriptionModalStore } from '@/store/subscriptionModalStore'

export const SubscriptionBlockedModal = () => {
    const { open, closeModal } = useSubscriptionModalStore()
    const { items, fetchItems, handleCheckout } = useSaasPlanStore()
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'PIX'>('CARD')
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        if (open) fetchItems()
    }, [open, fetchItems])

    if (!open) return null // 🔥 só renderiza quando o modal deve aparecer

    const handleGoToCheckout = async () => {
        if (!selectedPlan) return
        setIsProcessing(true)
        try {
            await handleCheckout(selectedPlan, paymentMethod)
        } catch (error) {
            console.error(error)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center relative">
           
                <h2 className="text-2xl font-bold mb-4">Assinatura necessária</h2>
                <p className="mb-6 text-gray-700">
                    Sua assinatura não está ativa. Escolha um plano para continuar usando a aplicação.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {items.map((plan) => (
                        <Button
                            key={plan.id}
                            variant={selectedPlan === plan.id ? 'default' : 'outline'}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {plan.name} - R${plan.price}
                        </Button>
                    ))}
                </div>

                <div className="flex justify-center gap-4 mb-6">
                    <Button
                        variant={paymentMethod === 'CARD' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('CARD')}
                    >
                        Cartão
                    </Button>
                    <Button
                        variant={paymentMethod === 'PIX' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('PIX')}
                    >
                        PIX
                    </Button>
                </div>

                <Button
                    className="w-full"
                    onClick={handleGoToCheckout}
                    disabled={!selectedPlan || isProcessing}
                >
                    {isProcessing ? 'Processando...' : 'Finalizar pagamento'}
                </Button>
            </div>
        </div>
    )
}
