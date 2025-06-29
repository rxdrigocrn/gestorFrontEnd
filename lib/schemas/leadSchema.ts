import { z } from 'zod'

export const leadSchema = z.object({
    id: z.string().uuid().optional(),
    type: z.string().min(2, 'Tipo é obrigatório'),
    cost: z.number().positive('Custo deve ser um número positivo').optional().nullable(),
    description: z.string().optional().nullable(),
    isDefault: z.boolean().default(false),
    // createdAt: z.string().optional().nullable(),
    // updatedAt: z.string().optional().nullable(),
    organizationId: z.string().uuid().optional().nullable(),
});

export type LeadFormData = z.infer<typeof leadSchema>

