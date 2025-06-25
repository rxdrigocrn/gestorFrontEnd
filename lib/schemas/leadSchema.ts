// leadSchema.ts
import { z } from 'zod'

export const leadSchema = z.object({
    type: z.string().min(2, 'Tipo é obrigatório'),
    cost: z.number().positive('Custo deve ser um número positivo'),
})

export type LeadValues = z.infer<typeof leadSchema>

