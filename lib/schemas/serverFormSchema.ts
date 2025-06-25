import { z } from 'zod'

export const serverSchema = z.object({
    id: z.string().uuid().optional(), // para edição pode ter id
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    cost: z.number().positive("Valor deve ser positivo"),
    credits: z.number().optional().nullable(),
    panelLink: z.string().url("Deve ser uma URL válida"),
    whatsappSession: z.string().optional().nullable(),
    androidAppUrl: z.string().url().optional().nullable(),
    androidAppUrlSec: z.string().url().optional().nullable(),
    iosAppUrl: z.string().url().optional().nullable(),
    samsungAppUrl: z.string().url().optional().nullable(),
    lgAppUrl: z.string().url().optional().nullable(),
    rokuAppUrl: z.string().url().optional().nullable(),
    organizationId: z.string().uuid().optional(),
})

export type ServerFormData = z.infer<typeof serverSchema>