import { z } from "zod";

export const planSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    periodType: z.enum(["DAYS", "MONTHS", "YEARS"]),
    periodValue: z.number().positive("Valor deve ser positivo").int(),
    creditsToRenew: z.number().positive("Valor deve ser positivo").nullable(),
    description: z.string().optional().nullable(),
    organizationId: z.string().uuid().optional().nullable(),
    // createdAt: z.string().optional(),
    // updatedAt: z.string().optional(),
});

export type PlanFormData = z.infer<typeof planSchema>;
