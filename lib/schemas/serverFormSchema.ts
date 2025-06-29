import { z } from 'zod'

const urlOrUndefined = z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    return val;
}, z.string().url().optional().nullable());


export const serverSchema = z.object({
    id: z.string().uuid().optional(), // para edição pode ter id
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    cost: z.number().positive("Valor deve ser positivo"),
    credits: z.number().nullable().optional(),
    panelLink: z.string().url("Deve ser uma URL válida"),
    whatsappSession: z.string().optional().nullable(),
    androidAppUrl: urlOrUndefined,
    androidAppUrlSec: urlOrUndefined,
    iosAppUrl: urlOrUndefined,
    samsungAppUrl: urlOrUndefined,
    lgAppUrl: urlOrUndefined,
    rokuAppUrl: urlOrUndefined,
    organizationId: z.string().uuid().optional(),
})

export type ServerFormData = z.infer<typeof serverSchema>