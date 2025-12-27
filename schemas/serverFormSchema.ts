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
    id: z.string().uuid().optional(),
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    cost: z.number().positive("Valor deve ser positivo"),
    credits: optionalNumber,
    panelLink: urlOrUndefined,
    whatsappSession: z.string().optional().nullable(),
    androidAppUrl: urlOrUndefined,
    androidAppUrlSec: urlOrUndefined,
    iosAppUrl: urlOrUndefined,
    samsungAppUrl: urlOrUndefined,
    lgAppUrl: urlOrUndefined,
    rokuAppUrl: urlOrUndefined,
    organizationId: z.string().uuid().optional(),
    dns1: z.string().optional(),
    dns2: z.string().optional(),
    dns3: z.string().optional(),
    dns4: z.string().optional(),
    urlApiXc: urlOrUndefined,
    urlApiSmarters: urlOrUndefined,
    epgUrl: urlOrUndefined,
    serverInfo: z.string().optional(),
})

export type ServerFormData = z.infer<typeof serverSchema>