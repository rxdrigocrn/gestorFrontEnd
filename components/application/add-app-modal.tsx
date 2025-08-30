'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, ApplicationFormData } from '@/schemas/applicationSchema'

import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Controller } from 'react-hook-form'

interface AddApplicationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (data: ApplicationFormData) => Promise<void> | void
    defaultValues?: Partial<ApplicationFormData>
}

export default function AddApplicationModal({
    open,
    onOpenChange,
    onConfirm,
    defaultValues
}: AddApplicationModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
        watch,
    } = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
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


    const onSubmit = async (data: ApplicationFormData) => {
        await onConfirm(data)
    }

    const onInvalid = (errors: any) => {
        console.error('Form validation errors:', errors)
    }

    return (
        <Modal open={open} title="Novo Aplicativo" onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 p-4">
                <div className="space-y-1">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        {...register('name')}
                        placeholder="Nome do aplicativo"
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
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
                )}
                {errors.isDefault && <p className="text-sm text-red-600">{errors.isDefault.message}</p>} */}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </form>
        </Modal>
    )
}
