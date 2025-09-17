import { z } from 'zod';

export const createMessageTemplateSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    name: z.string().min(1, "Nome é obrigatório"),
    content: z.string().min(1, "Descrição é obrigatória"),
    imageUrl: z.string().url("URL inválida").optional().nullable().or(z.literal('')),
});

export type MessageTemplateFormData = z.infer<typeof createMessageTemplateSchema>;