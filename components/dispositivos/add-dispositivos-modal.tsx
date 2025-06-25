'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deviceSchema, DeviceValues } from '@/lib/schemas/deviceSchema'

import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

interface AddDeviceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (data: DeviceValues) => Promise<void> | void
}

export function AddDeviceModal({
    open,
    onOpenChange,
    onConfirm,
}: AddDeviceModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<DeviceValues>({
        resolver: zodResolver(deviceSchema),
        defaultValues: {
            isDefault: false,
        },
    })

    useEffect(() => {
        if (open) reset()
    }, [open, reset])

    const isDefault = watch('isDefault')

    const onSubmit = async (data: DeviceValues) => {
        await onConfirm(data)
    }

    return (
        <Modal open={open} title="Novo dispositivo" onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="space-y-1">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        {...register('name')}
                        placeholder="Nome do dispositivo"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div className="flex items-center justify-between space-y-1">
                    <Label htmlFor="isDefault">Padrão</Label>
                    <Switch
                        id="isDefault"
                        checked={isDefault}
                        onCheckedChange={(value) => setValue('isDefault', value)}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </form>
        </Modal>
    )
}
