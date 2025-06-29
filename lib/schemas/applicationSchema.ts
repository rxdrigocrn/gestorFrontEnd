import { z } from 'zod'

export const applicationSchema = z.object({
    id: z.string().uuid().optional(),
    organizationId: z.string().uuid().optional().nullable(),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    isDefault: z.boolean(),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>