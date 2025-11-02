'use client'

import { Controller } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

interface FidelidadeSectionProps {
    form: any
}

export const FidelidadeSection = ({ form }: FidelidadeSectionProps) => {
    return (
        <div className="space-y-4 p-2">
            <h3 className="text-lg font-semibold">Pontos de Fidelidade</h3>

            <div className="flex items-center justify-between">
                <Label>Ativar sistema de pontos?</Label>
                <Controller
                    control={form.control}
                    name="loyaltyPointsEnabled"
                    render={({ field }) => <Switch checked={!!field.value} onCheckedChange={field.onChange} />}
                />
            </div>

            <div className="flex items-center justify-between">
                <Label>Permitir atrasos nos pontos?</Label>
                <Controller
                    control={form.control}
                    name="loyaltyPointsAllowDelays"
                    render={({ field }) => <Switch checked={!!field.value} onCheckedChange={field.onChange} />}
                />
            </div>

            <div>
                <Label>Percentual de desconto (%)</Label>
                <Input type="number" {...form.register('loyaltyPointsDiscountPercent')} />
            </div>

            <div>
                <Label>Pontos necessários para troca</Label>
                <Input type="number" {...form.register('loyaltyPointsNeeded')} />
            </div>
        </div>
    )
}
