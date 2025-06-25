import { z } from 'zod';

export const paymentMethodSchema = z.object({
    name: z.string().min(1, "Name is required"),
    feePercentage: z.number().min(0, "Fee percentage must be a non-negative number"),
});

export type PaymentMethodValues = z.infer<typeof paymentMethodSchema>;