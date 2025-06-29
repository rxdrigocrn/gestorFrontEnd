'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planSchema, PlanFormData } from '@/lib/schemas/planSchema'
import { Modal } from '@/components/ui/modal'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlanResponse } from '@/types/plan'

interface AddPlanModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (data: PlanFormData) => Promise<void> | void
    defaultValues?: Partial<PlanResponse>
}

export function AddPlanModal({ open, onOpenChange, onConfirm, defaultValues }: AddPlanModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<PlanFormData>({
        resolver: zodResolver(planSchema),
    })

    useEffect(() => {
        if (open) {
            reset(defaultValues || {});
        }
    }, [open, defaultValues, reset]);


    const onInvalid = (errors: any) => {
        console.error('Erros de validação do formulário:', errors);
    };

    const periodType = watch('periodType')

    const onSubmit = async (data: PlanFormData) => {
        await onConfirm(data)
    }

    return (
        <Modal open={open} title="Novo Plano" onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 p-4">
                <div className="space-y-1">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        {...register('name')}
                        placeholder="Nome do plano"
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="periodType">Tipo de Período</Label>
                    <Select
                        onValueChange={(value) => setValue('periodType', value as PlanFormData['periodType'])}
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
                    {errors.periodType && <p className="text-sm text-red-600">{errors.periodType.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="periodValue">Valor do Período</Label>
                    <Input
                        id="periodValue"
                        type="number"
                        {...register('periodValue', { valueAsNumber: true })}
                        placeholder="Valor"
                    />
                    {errors.periodValue && <p className="text-sm text-red-600">{errors.periodValue.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="creditsToRenew">Créditos para Renovação</Label>
                    <Input
                        id="creditsToRenew"
                        type="number"
                        {...register('creditsToRenew', { valueAsNumber: true })}
                        placeholder="Créditos"
                    />
                    {errors.creditsToRenew && <p className="text-sm text-red-600">{errors.creditsToRenew.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Descrição do plano"
                        rows={3}
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </form>
        </Modal>
    )
}
