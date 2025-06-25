import { PlanResponse } from './plan'
import { ServerResponse } from './server'
export type ClientBase = {
    name: string
    phone: string
    email?: string
    expiresAt: string
    notes?: string
    serverId: string
    planId: string
    deviceId?: string
    applicationId?: string
    paymentMethodId?: string
    leadSourceId?: string
    status: 'active' | 'inactive' | 'pending'
}

export type ClientCreate = ClientBase
export type ClientUpdate = ClientBase & {
    id: string
}

export type ClientResponse = ClientBase & {
    id: string
    createdAt: string
    updatedAt: string
    organizationId: string
    registeredById: string
    server: ServerResponse
    plan: PlanResponse
}

export type ClientList = ClientResponse[]


