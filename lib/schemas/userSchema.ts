import { z } from 'zod'
import { Role } from '@/types/user'

export const createUserSchema = z.object({
    id: z.string().uuid().optional(), // para edição pode ter id
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    role: z.nativeEnum(Role).default(Role.EMPLOYEE),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
