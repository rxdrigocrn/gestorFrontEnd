'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { registerSchema, RegisterFormValues } from '@/schemas/registerSchema'

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [serverErrors, setServerErrors] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setServerErrors(null)
    setSuccess(false)

    try {
      const response = await axios.post(
        `http://localhost:5000/auth/registro`,
        data,
        { withCredentials: true }
      )
      const token = response.data.accessToken
      if (response.status === 201) {
        setSuccess(true)
        sessionStorage.setItem('token', token)
        setTimeout(() => (window.location.href = '/subscription'), 1500)
      } else {
        setServerErrors('Falha no registro.')
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden border border-border"
      >
        <div className="p-8">
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
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Crie sua conta</h1>
            <p className="text-muted-foreground mt-2">
              Preencha os campos para começar
            </p>
          </div>

          {serverErrors && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-6 rounded-lg bg-destructive text-destructive-foreground text-sm flex items-center"
            >
              {serverErrors}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-6 rounded-lg bg-accent/20 text-accent-foreground text-sm flex items-center"
            >
              Conta criada com sucesso! Redirecionando...
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="organizationName">Nome da Organização</Label>
              <Input
                id="organizationName"
                placeholder="Minha Empresa LTDA"
                {...register('organizationName')}
              />
              {errors.organizationName && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.organizationName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="userName">Nome de Usuário</Label>
              <Input
                id="userName"
                placeholder="João da Silva"
                {...register('userName')}
              />
              {errors.userName && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.userName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Celular</Label>
              <Input
                id="phone"
                type="text"
                placeholder="(00) 00000-0000"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="cpf">CPF ou CNPJ</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                {...register('cpf')}
              />
              {errors.cpf && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.cpf.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="userEmail">E-mail</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="seu@email.com"
                {...register('userEmail')}
              />
              {errors.userEmail && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.userEmail.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="userPassword">Senha</Label>
              <Input
                id="userPassword"
                type="password"
                placeholder="••••••••"
                {...register('userPassword')}
              />
              {errors.userPassword && (
                <p className="mt-1.5 text-sm text-destructive">
                  {errors.userPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando conta...' : 'Registrar'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <a href="/login" className="font-medium text-primary hover:underline">
              Entrar
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
