import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})