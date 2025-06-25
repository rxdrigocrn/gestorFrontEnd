'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, ApplicationValues } from '@/lib/schemas/applicationSchema'

import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

interface AddApplicationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (data: ApplicationValues) => Promise<void> | void
}

export default function AddApplicationModal({
    open,
    onOpenChange,
    onConfirm
}: AddApplicationModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<ApplicationValues>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            isDefault: false,
        },
    })

    const isDefault = watch('isDefault')

    useEffect(() => {
        if (open) reset()
    }, [open, reset])

    const onSubmit = async (data: ApplicationValues) => {
        await onConfirm(data)
    }

    return (
        <Modal open={open} title="Novo Aplicativo" onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="space-y-1">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        {...register('name')}
                        placeholder="Nome do aplicativo"
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div className="flex items-center justify-between space-y-1">
                    <Label htmlFor="isDefault">Padrão</Label>
                    <Switch
                        id="isDefault"
                        checked={isDefault}
                        onCheckedChange={(checked) => setValue('isDefault', checked)}
                    />
                </div>
                {errors.isDefault && <p className="text-sm text-red-600">{errors.isDefault.message}</p>}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </form>
        </Modal>
    )
}
