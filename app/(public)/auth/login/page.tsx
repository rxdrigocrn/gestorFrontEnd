'use client'

import { useForm } from 'react-hook-form'
import { loginSchema } from '@/schemas/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'

type LoginFormValues = z.infer<typeof loginSchema>

const forgotSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [serverErrors, setServerErrors] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // estado do modal
  const [open, setOpen] = useState(false)
  const [forgotMessage, setForgotMessage] = useState<string | null>(null)
  const [forgotError, setForgotError] = useState<string | null>(null)
  const [isForgotLoading, setIsForgotLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgot,
  } = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setServerErrors(null)
    setSuccess(false)

    try {
      const response = await axios.post(
        `http://34.237.173.84/auth/login`,
        data,
        { withCredentials: true }
      )

      if (response.status === 201) {
        setSuccess(true)
        const token = response.data.accessToken
        sessionStorage.setItem('token', token)
        window.location.href = '/dashboard'
      } else {
        setServerErrors('Falha no login')
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setServerErrors(error.response.data.message)
      } else {
        setServerErrors('Erro inesperado. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onForgotSubmit = async (data: { email: string }) => {
    setForgotError(null)
    setForgotMessage(null)
    setIsForgotLoading(true)

    try {
      const response = await axios.post(
        `http://localhost:5000/auth/forgot-password`,
        data
      )

      if (response.status === 200) {
        setForgotMessage('E-mail de recuperação enviado com sucesso!')
        resetForgot()
      }
    } catch (error: any) {
      setForgotError(
        error.response?.data?.message ||
        'Não foi possível enviar o e-mail. Tente novamente.'
      )
    } finally {
      setIsForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden border border-border"
      >
        <div className="p-8">
          {/* cabeçalho e mensagens */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
            <p className="text-muted-foreground mt-2">
              Entre para acessar sua conta
            </p>
          </div>

          {/* mensagens de erro/sucesso */}
          {serverErrors && (
            <div className="p-3 mb-6 rounded-lg bg-destructive text-destructive-foreground text-sm">
              {serverErrors}
            </div>
          )}
          {success && (
            <div className="p-3 mb-6 rounded-lg bg-accent/20 text-accent-foreground text-sm">
              Login realizado com sucesso!
            </div>
          )}

          {/* FORM DE LOGIN */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
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

            <div className="flex items-center justify-center">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Esqueceu sua senha?
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Recuperar senha</DialogTitle>
                    <DialogDescription>
                      Digite o e-mail da sua conta e enviaremos instruções de recuperação.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="forgot-email">E-mail</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="seu@email.com"
                        {...registerForgot('email')}
                      />
                      {forgotErrors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {forgotErrors.email.message}
                        </p>
                      )}
                    </div>

                    {forgotMessage && (
                      <p className="text-sm text-green-600">{forgotMessage}</p>
                    )}
                    {forgotError && (
                      <p className="text-sm text-destructive">{forgotError}</p>
                    )}

                    <DialogFooter>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isForgotLoading}
                      >
                        {isForgotLoading ? 'Enviando...' : 'Enviar e-mail'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <a
              href="/auth/registro"
              className="font-medium text-primary hover:underline"
            >
              Cadastre-se
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
