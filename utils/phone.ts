// utils/phone.ts
export function formatPhoneToE164(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";

    if (digits.startsWith("55")) {
        return `+${digits}`;
    }

    return `+55${digits}`;
}
