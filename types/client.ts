import { PaymentMethodResponse } from './paymentMethod'
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
    status?: 'active' | 'inactive' | 'pending'
}

export type ClientCreate = ClientBase
export type ClientUpdate = ClientBase & {
    id: string
}

export type ClientResponse = {
    id: string
    name: string
    username?: string
    password?: string
    phone: string
    phone2?: string
    email: string
    status: 'active' | 'inactive' | 'pending'
    expiresAt: string
    notes?: string
    appDate?: string
    birthDate?: string
    m3u?: string
    mac?: string
    deviceKey?: string
    referredBy?: string
    organizationId: string
    registeredById: string
    serverId: string
    planId: string
    deviceId?: string
    applicationId?: string
    paymentMethodId?: string
    leadSourceId?: string
    amount?: number
    screens?: number
    totalCost?: number
    credit?: number
    pix?: string
    addPayment?: string
    sendMessage?: string
    createdAt?: string
    updatedAt?: string
    server: ServerResponse
    plan: PlanResponse
    paymentMethod: PaymentMethodResponse
    registeredBy?: {
        name: string
        email: string
    }
    stats?: {
        livValue: string
        livIndicados: string
        indicados: string
        clientAge: string
        daysUntilDue: string
        cost: string
    }
}


export type ClientPayment = {
    amount: number;
    paidAt: string;
    dueDate: string;
    paymentMethodId: string;
    discount: number;
    surcharge: number;
    notes: string;
    sendReceipt: boolean;
    renewClient: boolean;
}




export type ClientList = ClientResponse[]



