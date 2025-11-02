'use client'

import { Controller } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

interface ArquivamentoSectionProps {
    form: any
}

export const ArquivamentoSection = ({ form }: ArquivamentoSectionProps) => {
    return (
        <div className="space-y-4 p-2">
            <h3 className="text-lg font-semibold">Arquivamento Automático</h3>

            <div className="flex items-center justify-between">
                <Label>Ativar arquivamento automático?</Label>
                <Controller
                    control={form.control}
                    name="autoArchiveClients"
                    render={({ field }) => <Switch checked={!!field.value} onCheckedChange={field.onChange} />}
                />
            </div>

            <div>
                <Label>Dias para arquivar clientes inativos</Label>
                <Input type="number" {...form.register('autoArchiveClientDays')} />
            </div>
        </div>
    )
}
