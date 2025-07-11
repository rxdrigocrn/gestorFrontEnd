import { z } from 'zod'

const urlOrUndefined = z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    return val;
}, z.string().url().optional().nullable());

const optionalNumber = z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? undefined : parsed;
}, z.number().nullable().optional());


export const serverSchema = z.object({
    id: z.string().uuid().optional(), // para edição pode ter id
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    cost: z.number().positive("Valor deve ser positivo"),
    credits: optionalNumber,
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