import { z } from 'zod';

export const createMessageTemplateSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    name: z.string().min(1, "Name is required"),
    content: z.string().min(1, "Content is required"),
    imageUrl: z.string().url("URL inválida").optional().nullable().or(z.literal('')),
});

export type MessageTemplateFormData = z.infer<typeof createMessageTemplateSchema>;