'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem.',
        path: ['confirmPassword'],
    })

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    })

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) {
            setError('Token inválido ou ausente.')
            return
        }

        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            const response = await axios.post(
                'http://localhost:5000/auth/reset-password',
                {
                    token,
                    password: data.password,
                }
            )

            if (response.status === 200) {
                setMessage('Senha redefinida com sucesso! Redirecionando...')
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Erro ao redefinir senha. Tente novamente.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden border border-border p-8"
            >
                <h1 className="text-2xl font-semibold text-center mb-2">
                    Redefinir senha
                </h1>
                <p className="text-sm text-muted-foreground text-center mb-6">
                    Digite sua nova senha abaixo.
                </p>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive text-destructive-foreground text-sm">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-700 text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <Label htmlFor="password">Nova senha</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword">Confirmar senha</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={loading}
                    >
                        {loading ? 'Enviando...' : 'Redefinir senha'}
                    </Button>
                </form>
            </motion.div>
        </div>
    )
}
