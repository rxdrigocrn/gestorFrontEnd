'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentMethodSchema, PaymentMethodFormData } from '@/lib/schemas/paymentMethod'

import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '../ui/textarea'

interface AddPaymentMethodModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (data: PaymentMethodFormData) => Promise<void> | void
    defaultValues?: Partial<PaymentMethodFormData>;

}

export function AddPaymentMethodModal({
    open,
    onOpenChange,
    onConfirm,
    defaultValues,
}: AddPaymentMethodModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<PaymentMethodFormData>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            name: '',
            description: '',
            feePercentage: 0,
            ...defaultValues,
        },
    })

    useEffect(() => {
        if (open) {
            reset(defaultValues);
        }
    }, [open, defaultValues, reset]);

    const onInvalid = (errors: any) => {
        console.error('Form validation errors:', errors);
    };

    const onSubmit = async (data: PaymentMethodFormData) => {
        await onConfirm(data)
    }

    return (
        <Modal open={open} title="Novo Método de pagamento" onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 p-4">
                <div className="space-y-1">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        {...register('name')}
                        placeholder="Nome da forma de pagamento"
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="description">Descrição (Opcional)</Label>
                    <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Descrição da forma de pagamento"
                    />
                    {errors.description && (
                        <p className="text-sm text-red-600">{errors.description.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="feePercentage">Taxa (%)</Label>
                    <Input
                        id="feePercentage"
                        type="number"
                        step="0.01"
                        {...register('feePercentage', { valueAsNumber: true })}
                        placeholder="Porcentagem da taxa"
                    />
                    {errors.feePercentage && (
                        <p className="text-sm text-red-600">{errors.feePercentage.message}</p>
                    )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </form>
        </Modal>
    )
}
