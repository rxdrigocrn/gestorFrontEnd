import * as z from "zod"

export const registerSchema = z.object({
  organizationName: z
    .string()
    .min(1, "O nome da organização é obrigatório."),
  userName: z.string().min(1, "O nome do usuário é obrigatório."),
  userEmail: z.string().email("E-mail inválido."),
  userPassword: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres."),
    cpf: z.string().min(11, "CPF/CNPJ inválido."),
    phone: z.string().min(10, "Telefone inválido."),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
