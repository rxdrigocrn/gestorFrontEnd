import { z } from 'zod'

export const deviceSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    isDefault: z.boolean()
})

export type DeviceValues = z.infer<typeof deviceSchema>