import { z } from "zod";

export const clientFormSchema = z.object({
    // Personal Data
    name: z.string().optional(),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    phone2: z.string().optional(),
    dueDate: z.date().optional(),
    dueTime: z.string().optional(),
    expiresAt: z.string().optional(),
    notes: z.string().optional(),

    // Payment
    serverId: z.string().optional(),
    planId: z.string().optional(),
    paymentMethodId: z.string().optional(),
    amount: z.number().optional(),
    screens: z.number().optional(),
    totalCost: z.number().optional(),
    credit: z.number().optional(),
    pix: z.string().optional(),
    addPayment: z.enum(["yes", "no"]).optional(),
    sendMessage: z.enum(["yes", "no"]).optional(),

    // Additional Info
    leadSourceId: z.string().optional(),
    referredBy: z.string().optional(),
    deviceId: z.string().optional(),
    applicationId: z.string().optional(),
    appDate: z.date().optional(),
    m3u: z.string().optional(),
    mac: z.string().optional(),
    deviceKey: z.string().optional(),
    birthDate: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
