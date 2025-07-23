import { ServerResponse } from "node:http"
import { ApplicationResponse } from "./application"
import { PaymentStatus } from "./client"
import { DeviceResponse } from "./device"
import { PaymentMethodResponse } from "./paymentMethod"
import { PlanResponse } from "./plan"

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

