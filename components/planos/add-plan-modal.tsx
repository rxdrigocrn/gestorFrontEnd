'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planSchema, PlanFormData } from '@/schemas/planSchema'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { PlanResponse } from '@/types/plan'

interface AddPlanModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (data: PlanFormData) => Promise<void> | void
    defaultValues?: Partial<PlanResponse>
}

// 🧩 Planos mockados
const predefinedPlans = [
    { label: 'Mensal', name: 'Plano Mensal', periodType: 'MONTHS', periodValue: 1, creditsToRenew: 1 },
    { label: 'Bimestral', name: 'Plano Bimestral', periodType: 'MONTHS', periodValue: 2, creditsToRenew: 2 },
    { label: 'Trimestral', name: 'Plano Trimestral', periodType: 'MONTHS', periodValue: 3, creditsToRenew: 3 },
    { label: 'Semestral', name: 'Plano Semestral', periodType: 'MONTHS', periodValue: 6, creditsToRenew: 6 },
    { label: 'Anual', name: 'Plano Anual', periodType: 'MONTHS', periodValue: 12, creditsToRenew: 12 },
]

export function AddPlanModal({ open, onOpenChange, onConfirm, defaultValues }: AddPlanModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<PlanFormData & { preset?: string }>({
        resolver: zodResolver(planSchema),
    })

    const selectedPreset = watch('preset')
    const periodType = watch('periodType')

    useEffect(() => {
        if (open) {
            reset(defaultValues || {})
            if (!defaultValues) {
                setValue('preset', 'CUSTOM')
            } else {
                setValue('preset', '')
            }
        }
    }, [open, defaultValues, reset])

    useEffect(() => {
        if (!selectedPreset) return

        if (selectedPreset === 'CUSTOM') {
            reset({
                preset: 'CUSTOM',
                name: undefined,
                periodType: undefined,
                periodValue: undefined,
                creditsToRenew: undefined,
                description: undefined,
            })
            return
        }

        const plan = predefinedPlans.find((p) => p.label === selectedPreset)
        if (plan) {
            setValue('name', plan.name)
            setValue('periodType', plan.periodType as any)
            setValue('periodValue', plan.periodValue)
            setValue('creditsToRenew', plan.creditsToRenew)
        }
    }, [selectedPreset, setValue])

    const onSubmit = async (data: PlanFormData) => {
        // `preset` é apenas para controle local da UI — não enviar ao backend
        const payload: any = { ...data } as any
        if (payload && Object.prototype.hasOwnProperty.call(payload, 'preset')) {
            delete payload.preset
        }

        await onConfirm(payload)
    }

    return (
        <Modal open={open} title="Novo Plano" onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                {/* SELECT de planos padrão */}
                <div className="space-y-1">
                    <Label>Modelo de Plano</Label>
                    <Select
                        onValueChange={(value) => setValue('preset', value)}
                        value={selectedPreset || ''}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um modelo de plano" />
                        </SelectTrigger>
                        <SelectContent>
                            {predefinedPlans.map((plan) => (
                                <SelectItem key={plan.label} value={plan.label}>
                                    {plan.label}
                                </SelectItem>
                            ))}
                            <SelectItem value="CUSTOM">Personalizado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Campos do formulário só aparecem se for "Personalizado" ou ainda não selecionado */}
                {(!selectedPreset || selectedPreset === 'CUSTOM') && (
                    <>
                        <div className="space-y-1">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" {...register('name')} placeholder="Nome do plano" />
                            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="periodType">Tipo de Período</Label>
                            <Select
                                onValueChange={(value) =>
                                    setValue('periodType', value as PlanFormData['periodType'])
                                }
                                value={periodType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo de período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DAYS">Dias</SelectItem>
                                    <SelectItem value="MONTHS">Meses</SelectItem>
                                    <SelectItem value="YEARS">Anos</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.periodType && (
                                <p className="text-sm text-red-600">{errors.periodType.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="periodValue">Valor do Período</Label>
                            <Input
                                id="periodValue"
                                type="number"
                                step="1"
                                {...register('periodValue', { valueAsNumber: true })}
                                placeholder="Quantidade (ex: 1, 3, 6...)"
                            />
                            {errors.periodValue && (
                                <p className="text-sm text-red-600">{errors.periodValue.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="creditsToRenew">Créditos para Renovação</Label>
                            <Input
                                id="creditsToRenew"
                                type="number"
                                step="0.01"
                                min="0.01"
                                {...register('creditsToRenew', { valueAsNumber: true })}
                                placeholder="Número de créditos (ex: 1, 0.5)"
                            />
                            {errors.creditsToRenew && (
                                <p className="text-sm text-red-600">
                                    {errors.creditsToRenew.message}
                                </p>
                            )}
                        </div>

                    </>
                )}
                <div className="space-y-1">
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Descrição do plano"
                        rows={3}
                    />
                    {errors.description && (
                        <p className="text-sm text-red-600">{errors.description.message}</p>
                    )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </form>
        </Modal>
    )
}
