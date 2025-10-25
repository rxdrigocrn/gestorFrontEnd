'use client'

import { CheckIcon, CrownIcon, StarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PlanCardProps {
    id: string
    name: string
    description?: string
    price: number
    features?: string[]
    onSelect?: () => void
    selected?: boolean
    popular?: boolean
    billingInterval?: 'month' | 'year'
}

export function PlanCard({
    id,
    name,
    description,
    price,
    features = [],
    onSelect,
    selected,
    popular = false,
    billingInterval = 'month'
}: PlanCardProps) {
    return (
        <div className="relative">
            {/* Badge para plano popular */}
            {popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1.5 font-semibold shadow-lg border-0">
                        <StarIcon className="w-3 h-3 mr-1 fill-current" />
                        Mais Popular
                    </Badge>
                </div>
            )}

            {/* Badge para plano selecionado */}
            {selected && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-1.5 font-semibold shadow-lg border-0">
                        <CheckIcon className="w-3 h-3 mr-1" />
                        Selecionado
                    </Badge>
                </div>
            )}

            <Card
                onClick={onSelect}
                className={`
          relative rounded-2xl border-2 transition-all duration-300 cursor-pointer h-full
          transform hover:scale-[1.02] hover:shadow-xl
          ${selected
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg ring-2 ring-emerald-200 ring-opacity-50'
                        : popular
                            ? 'border-amber-200 bg-white hover:border-amber-300 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                    }
        `}
            >
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-gray-900">{name}</CardTitle>
                        {selected && (
                            <CrownIcon className="w-5 h-5 text-emerald-500" />
                        )}
                    </div>
                    {description && (
                        <CardDescription className="text-sm mt-2">{description}</CardDescription>
                    )}
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Preço */}
                    <div className="text-center">
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-bold text-gray-900">R$ {price.toFixed(2)}</span>
                            <span className="text-base font-normal text-gray-500">
                                /{billingInterval === 'month' ? 'mês' : 'ano'}
                            </span>
                        </div>
                        {billingInterval === 'year' && (
                            <p className="text-sm text-emerald-600 font-medium mt-1">
                                Economize 20% vs mensal
                            </p>
                        )}
                    </div>

                    {/* Lista de features */}
                    {features.length > 0 && (
                        <ul className="space-y-3">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selected ? 'text-emerald-500' : 'text-gray-400'
                                        }`} />
                                    <span className={`text-sm ${selected ? 'text-gray-800 font-medium' : 'text-gray-600'
                                        }`}>
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Botão de seleção sutil */}
                    <div
                        className={`
              w-full py-2 px-4 rounded-lg text-center font-semibold text-sm transition-all
              ${selected
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
            `}
                    >
                        {selected ? 'Plano Selecionado' : 'Selecionar Plano'}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}