'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadSchema, LeadValues } from '@/lib/schemas/leadSchema'

import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface AddLeadModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (data: LeadValues) => Promise<void> | void
}

export function AddLeadModal({ open, onOpenChange, onConfirm }: AddLeadModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<LeadValues>({
        resolver: zodResolver(leadSchema),
    })

    useEffect(() => {
        if (open) reset()
    }, [open, reset])

    const onSubmit = async (data: LeadValues) => {
        await onConfirm(data)
    }

    return (
        <Modal open={open} title="Nova Captação" onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="space-y-1">
                    <Label htmlFor="type">Tipo</Label>
                    <Input
                        id="type"
                        {...register('type')}
                        placeholder="Tipo do lead"
                    />
                    {errors.type && (
                        <p className="text-sm text-red-600">{errors.type.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="cost">Custo</Label>
                    <Input
                        id="cost"
                        type="number"
                        {...register('cost', { valueAsNumber: true })}
                        placeholder="Custo do lead"
                    />
                    {errors.cost && (
                        <p className="text-sm text-red-600">{errors.cost.message}</p>
                    )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </form>
        </Modal>
    )
}

