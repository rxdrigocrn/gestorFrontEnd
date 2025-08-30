import { z } from 'zod'

export const deviceSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    organizationId: z.string().uuid().optional().nullable(),
})

export type DeviceFormData = z.infer<typeof deviceSchema>