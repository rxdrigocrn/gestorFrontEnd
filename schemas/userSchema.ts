import { z } from 'zod'
import { Role } from '@/types/user'

export const createUserSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    role: z.nativeEnum(Role).default(Role.EMPLOYEE),
    cpf: z.string().min(11, 'CPF/CNPJ inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
