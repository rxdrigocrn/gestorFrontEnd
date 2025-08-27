'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deviceSchema, DeviceFormData } from '@/lib/schemas/deviceSchema'

import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
// import { Switch } from '@/components/ui/switch'
// import { Controller } from 'react-hook-form'

interface AddDeviceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (data: DeviceFormData) => Promise<void> | void
    defaultValues?: Partial<DeviceFormData>
}

export function AddDeviceModal({
    open,
    onOpenChange,
    onConfirm,
    defaultValues,
}: AddDeviceModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
        control
    } = useForm<DeviceFormData>({
        resolver: zodResolver(deviceSchema),
        defaultValues: {
            name: '',
            // isDefault: false,
            ...defaultValues,
        },
    })

    useEffect(() => {
        if (open) {
            reset({
                // isDefault: false,
                ...defaultValues,
            });
        }
    }, [open, defaultValues, reset]);


    // const isDefault = watch('isDefault')

    const onSubmit = async (data: DeviceFormData) => {
        await onConfirm(data)
    }

    const onInvalid = (errors: any) => {
        console.error('Form errors:', errors)
    }

    return (
        <Modal open={open} title="Novo dispositivo" onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 p-4">
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

                {/* <div className="flex items-center justify-between space-y-1">
                    <Label htmlFor="isDefault">Padrão</Label>
                    <Controller
                        control={control}
                        name="isDefault"
                        render={({ field }) => (
                            <Switch
                                id="isDefault"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                </div>
                {errors.isDefault && (
                    <p className="text-sm text-red-600">{errors.isDefault.message}</p>
                )} */}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </form>
        </Modal>
    )
}
