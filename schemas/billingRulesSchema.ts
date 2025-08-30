import { z } from 'zod';

// Enums replicando o DTO do backend
export enum AutomaticRuleType {
  DAYS_BEFORE_EXPIRATION = 'DAYS_BEFORE_EXPIRATION',
  MONTHLY_DAY_RANGE = 'MONTHLY_DAY_RANGE',
}

export enum BillingRuleType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export enum BillingRuleClientStatus {
  VENCIDO = 'VENCIDO',
  ATIVO = 'ATIVO',
  VENCE_HOJE = 'VENCE_HOJE',
  TODOS = 'TODOS',
}

export const billingRuleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  type: z.nativeEnum(BillingRuleType, { required_error: "O tipo da regra é obrigatório." }),
  messageTemplateId: z.string().uuid({ message: "Selecione um template de mensagem válido." }),

  // --- Filtros ---
  deviceIds: z.array(z.string().uuid()).optional(),
  applicationIds: z.array(z.string().uuid()).optional(),
  serverIds: z.array(z.string().uuid()).optional(),
  planIds: z.array(z.string().uuid()).optional(),
  leadSourceIds: z.array(z.string().uuid()).optional(),
  clientStatus: z.nativeEnum(BillingRuleClientStatus, { required_error: "O status do cliente é obrigatório." }),
  paymentMethodIds: z.array(z.string().uuid()).optional(),

  // --- Lógica para Regras Automáticas ---
  automaticType: z.nativeEnum(AutomaticRuleType).optional(),
  days: z.coerce.number().min(0).optional(),
  startDay: z.coerce.number().min(1).max(31).optional(),
  endDay: z.coerce.number().min(1).max(31).optional(),
})
  .superRefine((data, ctx) => {
    if (data.type === BillingRuleType.AUTOMATIC) {
      if (!data.automaticType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['automaticType'],
          message: 'O tipo de regra automática é obrigatório.',
        });
      }

      if (data.automaticType === AutomaticRuleType.DAYS_BEFORE_EXPIRATION && data.days === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['days'],
          message: 'A quantidade de dias é obrigatória.',
        });
      }

      if (data.automaticType === AutomaticRuleType.MONTHLY_DAY_RANGE) {
        if (data.startDay === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['startDay'],
            message: 'O dia de início é obrigatório.',
          });
        }
        if (data.endDay === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['endDay'],
            message: 'O dia de fim é obrigatório.',
          });
        }
        if (data.startDay && data.endDay && data.startDay > data.endDay) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['endDay'],
            message: 'O dia de fim deve ser maior ou igual ao dia de início.',
          });
        }
      }
    }
  });

export type BillingRuleFormData = z.infer<typeof billingRuleSchema>;