import { ServerResponse } from "node:http"
import { ApplicationResponse } from "./application"
import { PaymentStatus } from "./client"
import { DeviceResponse } from "./device"
import { PaymentMethodResponse } from "./paymentMethod"
import { PlanResponse } from "./plan"
import { BillingRuleFormData } from "@/lib/schemas/billingRulesSchema"

export type BillingRuleBase = {
    name: string
    minIntervalDays: number
    maxIntervalDays: number
    clientStatus?: PaymentStatus
    messageTemplateId: string
}

export type BillingRuleCreate = BillingRuleBase

export type BillingRuleUpdate = BillingRuleBase & {
    id: string
}

export type BillingRuleResponse = BillingRuleBase & {
    id: string
    createdAt: string
    updatedAt: string
    servers: ServerResponse[]
    plans: PlanResponse[]
    devices: DeviceResponse[]
    applications: ApplicationResponse[]
    paymentMethods: PaymentMethodResponse[]

}

export type BillingRuleList = BillingRuleResponse[]






export function mapBillingResToFormData(response: BillingRuleResponse): BillingRuleFormData {
    return {
        id: response.id ?? null,
        name: response.name,
        minIntervalDays: response.minIntervalDays,
        maxIntervalDays: response.maxIntervalDays,
        messageTemplateId: response.messageTemplateId,
        clientStatus: mapPaymentStatus(response.clientStatus),
    }
}


export function mapPaymentStatus(status?: PaymentStatus): BillingRuleFormData["clientStatus"] {
    switch (status) {
        case PaymentStatus.PAID:
        case PaymentStatus.PENDING:
        case PaymentStatus.OVERDUE:
        case PaymentStatus.CANCELED:
            return status as unknown as BillingRuleFormData["clientStatus"]
        default:
            return undefined
    }
}
