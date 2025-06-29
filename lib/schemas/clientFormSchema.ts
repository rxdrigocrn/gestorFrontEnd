import { z } from "zod";

const numberOrUndefined = z
    .preprocess((val) => {
        if (typeof val === "string" && val.trim() === "") return undefined;
        if (typeof val === "number" && isNaN(val)) return undefined;
        return val;
    }, z.number().optional());

export const clientFormSchema = z.object({
    // Personal Data
    id: z.string().uuid().optional().nullable(),
    name: z.string().optional().nullable(),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    email: z.string().email("Invalid email address").optional().nullable(),
    phone: z.string().optional().nullable(),
    phone2: z.string().optional().nullable(),
    dueDate: z.date().optional(),
    dueTime: z.date().optional(),
    expiresAt: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),

    // Payment
    serverId: z.string(),
    planId: z.string(),
    paymentMethodId: z.string().optional().nullable(),
    amount: numberOrUndefined,
    screens: numberOrUndefined,
    totalCost: numberOrUndefined,
    credit: numberOrUndefined,
    pix: z.string().optional().nullable(),
    addPayment: z.string().optional().nullable(),
    sendMessage: z.string().optional().nullable(),

    // Additional Info
    leadSourceId: z.string().optional().nullable(),
    referredBy: z.string().optional().nullable(),
    deviceId: z.string().optional().nullable(),
    applicationId: z.string().optional().nullable(),
    appDate: z.date().optional().nullable(),
    m3u: z.string().optional().nullable(),
    mac: z.string().optional().nullable(),
    deviceKey: z.string().optional().nullable(),
    birthDate: z.string().optional().nullable(),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

