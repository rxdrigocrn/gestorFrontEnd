import { z } from "zod";
import { isValidPhoneNumber } from 'libphonenumber-js'

const numberOrUndefined = z
    .preprocess((val) => {
        if (typeof val === "string" && val.trim() === "") return undefined;
        if (typeof val === "number" && isNaN(val)) return undefined;
        return val;
    }, z.number().optional());

const stringOrUndefined = <T extends z.ZodTypeAny>(inner: T) =>
    z.preprocess(
        (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
        inner.optional()
    );


export const clientFormSchema = z.object({
    // Personal Data
    id: z.string().uuid().optional().nullable(),
    name: z.string().optional().nullable(),
    username: z.string().min(1, "Usuário  obrigatório"),
    password: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z
        .string()
        .refine((val) => isValidPhoneNumber(val), {
            message: 'Número de telefone inválido',
        }),
    phone2: z
        .string()
        .optional()
        .nullable()
        .refine((val) => {
            if (!val) return true
            return isValidPhoneNumber(val)
        }, {
            message: 'Número de telefone secundário inválido',
        }),

    expiresAt: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
            "A data deve estar no formato YYYY-MM-DD"
        ), notes: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    time: z.string().optional().nullable(),

    // Payment
    serverId: z.string(),
    planId: z.string(),
    paymentMethodId: z.string().optional().nullable(),
    screens: numberOrUndefined,
    pix: z.string().optional().nullable(),
     paidValue: numberOrUndefined,
    clientCost: numberOrUndefined,

    // Additional Info
    leadSourceId: z.string().optional().nullable(),
    referredBy: z.string().optional().nullable(),
    deviceId: z.string().optional().nullable(),
    applicationId: z.string().optional().nullable(),
    appDate: z.union([z.string(), z.date()]).optional().nullable(),
    m3u: z.string().optional().nullable(),
    mac: z.string().optional().nullable(),
    deviceKey: z.string().optional().nullable(),
    birthDate: z.string().optional().nullable(),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;



// import { z } from "zod";

// // --- Helpers ---------------------------------------------------
// const numberOrUndefined = z.preprocess(
//   (val) => {
//     if (typeof val === "string" && val.trim() === "") return undefined;
//     if (typeof val === "number" && isNaN(val)) return undefined;
//     return val;
//   },
//   z.number().optional()
// );

// const stringOrUndefined = <T extends z.ZodTypeAny>(inner: T) =>
//   z.preprocess(
//     (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
//     inner.optional()
//   );

// // --- Schema ----------------------------------------------------
// export const clientFormSchema = z.object({
//   // Dados pessoais
//   id: stringOrUndefined(z.string().uuid()),
//   name: stringOrUndefined(z.string()),
//   username: z.string().nonempty("Username é obrigatório"),
//   password: z
//     .string()
//     .min(6, "A senha deve ter ao menos 6 caracteres")
//     .nonempty("Senha é obrigatória"),
//   email: stringOrUndefined(z.string().email("E‑mail inválido")),
//   phone: z.string().nonempty("Telefone é obrigatório"),
//   phone2: stringOrUndefined(z.string()),
//   expiresAt: z.string().nonempty("Data de expiração é obrigatória"),
//   notes: stringOrUndefined(z.string()),
//   location: stringOrUndefined(z.string()),
//   time: stringOrUndefined(z.string()),

//   // Pagamento
//   serverId: stringOrUndefined(z.string()),
//   planId: stringOrUndefined(z.string()),
//   paymentMethodId: stringOrUndefined(z.string()),
//   screens: numberOrUndefined,
//   pix: stringOrUndefined(z.string()),

//   // Informações adicionais
//   leadSourceId: stringOrUndefined(z.string()),
//   referredBy: stringOrUndefined(z.string()),
//   deviceId: stringOrUndefined(z.string()),
//   applicationId: stringOrUndefined(z.string()),
//   appDate: stringOrUndefined(z.string()),
//   m3u: stringOrUndefined(z.string()),
//   mac: stringOrUndefined(z.string()),
//   deviceKey: stringOrUndefined(z.string()),
//   birthDate: stringOrUndefined(z.string()),
// });

// export type ClientFormData = z.infer<typeof clientFormSchema>;
