'use client'

import { Controller } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

interface RevendasSectionProps {
    form: any
}

export const RevendasSection = ({ form }: RevendasSectionProps) => {
    return (
        <div className="space-y-4 p-2">
            <h3 className="text-lg font-semibold">Revendas</h3>

            <div className="flex items-center justify-between">
                <Label>Subtrair créditos automaticamente?</Label>
                <Controller
                    control={form.control}
                    name="resellerSubtractCredits"
                    render={({ field }) => (
                        <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                    )}
                />
            </div>

            <div className="flex items-center justify-between">
                <Label>Exibir alerta de créditos baixos?</Label>
                <Controller
                    control={form.control}
                    name="resellerLowCreditsWarning"
                    render={({ field }) => (
                        <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                    )}
                />
            </div>

            <div>
                <Label>Créditos mínimos para alerta</Label>
                <Input type="number" {...form.register('resellerMinCreditsThreshold')} />
            </div>
        </div>
    )
}
