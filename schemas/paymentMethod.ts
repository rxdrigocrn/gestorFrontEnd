import { z } from 'zod';

export const paymentMethodSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Nome é obrigatório"),
    feePercentage: z.number().min(0, "Não pode ser negativo"),
    description: z.string().optional().nullable(),
    organizationId: z.string().optional(),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

