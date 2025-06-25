import { z } from "zod";

export const planSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    periodType: z.enum(["DAYS", "WEEKS", "MONTHS", "YEARS"]),
    periodValue: z.number().positive("Valor deve ser positivo").int(),
    creditsToRenew: z.number().positive("Valor deve ser positivo").int(),
    description: z.string().optional().nullable(),
});


export type PlanValues = z.infer<typeof planSchema>;