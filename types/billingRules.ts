import { BillingRuleFormData, BillingRuleClientStatus, BillingRuleType, AutomaticRuleType } from "@/schemas/billingRulesSchema"

export type BillingRuleBase = {
    name: string
    messageTemplateId: string
    clientStatus: BillingRuleClientStatus
    minIntervalDays?: number
    maxIntervalDays?: number
}

export type BillingRuleCreate = BillingRuleBase
export type BillingRuleUpdate = BillingRuleBase & { id: string }

export type BillingRuleResponse = {
    id: string
    name: string
    type: BillingRuleType
    clientStatus?: BillingRuleClientStatus
    messageTemplateId: string
    createdAt: string
    updatedAt: string

    // --- Filtros ---
    deviceIds: string[]
    applicationIds: string[]
    serverIds: string[]
    planIds: string[]
    leadSourceIds: string[]
    paymentMethodIds: string[]  

    // --- Automáticas ---
    automaticType?: AutomaticRuleType | null
    days?: number | null
    startDay?: number | null
    endDay?: number | null


}

export type BillingRuleList = BillingRuleResponse[]

export function mapBillingResToFormData(response: BillingRuleResponse): BillingRuleFormData {
    return {
        id: response.id,
        name: response.name,
        type: response.type,
        messageTemplateId: response.messageTemplateId,

        // filtros
        deviceIds: response.deviceIds ?? [],
        applicationIds: response.applicationIds ?? [],
        serverIds: response.serverIds ?? [],
        planIds: response.planIds ?? [],
        leadSourceIds: response.leadSourceIds ?? [],
 
        // status (fallback = TODOS)
        clientStatus: response.clientStatus ?? BillingRuleClientStatus.TODOS,

        // automáticas
        automaticType: response.automaticType ?? undefined,
        days: response.days ?? undefined,
        startDay: response.startDay ?? undefined,
        endDay: response.endDay ?? undefined,


    }
}

export function mapFormDataToBillingDto(
    form: BillingRuleFormData
): Omit<BillingRuleResponse, "id" | "createdAt" | "updatedAt"> {
    return {
        name: form.name,
        type: form.type,
        messageTemplateId: form.messageTemplateId,
        clientStatus: form.clientStatus ?? BillingRuleClientStatus.TODOS,

        // filtros
        deviceIds: form.deviceIds ?? [],
        applicationIds: form.applicationIds ?? [],
        serverIds: form.serverIds ?? [],
        planIds: form.planIds ?? [],
        leadSourceIds: form.leadSourceIds ?? [],
        paymentMethodIds: form.paymentMethodIds ?? [],

        // automáticas
        automaticType: form.automaticType,
        days: form.days,
        startDay: form.startDay,
        endDay: form.endDay,


    }
}
