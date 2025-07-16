import { z } from 'zod';

export const billingRuleSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    name: z.string().min(1, "Name is required"),
    minIntervalDays: z.coerce.number().int(), // converte de string p/ número automaticamente
    maxIntervalDays: z.coerce.number().int(),
    messageTemplateId: z.string().uuid("Must be a valid UUID"),
    clientStatus: z.enum(['PAID', 'PENDING', 'OVERDUE', 'CANCELED']).optional(),
});


export type BillingRuleFormData = z.infer<typeof billingRuleSchema>;