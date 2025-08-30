'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema, CreateUserFormData } from '@/schemas/userSchema'
import { Role } from '@/types/user'

import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Eye, EyeOff } from 'lucide-react'

interface AddUserModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (data: CreateUserFormData) => Promise<void> | void
    defaultValues?: Partial<CreateUserFormData>
}

export function AddUserModal({
    open,
    onOpenChange,
    onConfirm,
    defaultValues,
}: AddUserModalProps) {
    const [showPassword, setShowPassword] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: Role.EMPLOYEE,
            ...defaultValues,
        },
    })

    useEffect(() => {
        if (open) {
            reset({
                name: '',
                email: '',
                password: '',
                role: Role.EMPLOYEE,
                ...defaultValues,
            })
        }
    }, [open, defaultValues, reset])

    const onSubmit = async (data: CreateUserFormData) => {
        await onConfirm(data)
    }

    return (
        <Modal open={open} title="Novo funcionário" onOpenChange={onOpenChange}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="space-y-1">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" {...register('name')} placeholder="Nome do funcionário" />
                    {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} placeholder="Email" />
                    {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            placeholder="Senha"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="role">Cargo</Label>
                    <Controller
                        control={control}
                        name="role"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Selecione o cargo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={Role.ADMIN}>Administrador</SelectItem>
                                    <SelectItem value={Role.EMPLOYEE}>Funcionário</SelectItem>
                                    <SelectItem value={Role.MANAGER}>Gerente</SelectItem>
                                    <SelectItem value={Role.RESELLER}>Revendedor</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.role && (
                        <p className="text-sm text-red-600">{errors.role.message}</p>
                    )}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
            </form>
        </Modal>
    )
}
