import { DeviceResponse } from './device'
import { PaymentMethodResponse } from './paymentMethod'
import { PlanResponse } from './plan'
import { ServerResponse } from './server'
import { ApplicationResponse } from './application'
import { LeadSourceResponse } from './lead'
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
    publicId?: string
    name: string
    username?: string
    password?: string
    phone: string
    phone2?: string
    email?: string
    status: 'active' | 'inactive' | 'pending'
    expiresAt?: string
    notes?: string
    appDate?: string
    birthDate?: string
    m3u?: string
    mac?: string
    deviceKey?: string
    referredBy?: string
    organizationId: string
    registeredById: string
    serverId?: string
    planId?: string
    deviceId?: string
    applicationId?: string
    paymentMethodId?: string
    leadSourceId?: string
    screens?: number
    pix?: string
    location?: string
    loyaltyPoints?: number
    isArchived: boolean
    archivedAt?: string
    wasImported: boolean
    importedAt?: string
    disableMessagesUntil?: string
    time?: string
    createdAt?: string
    updatedAt?: string
    organization: {
        id: string
        name: string
    }
    registeredBy: {
        id: string
        name: string
        email: string
    }
    server?: ServerResponse
    plan?: PlanResponse
    device?: DeviceResponse
    application?: ApplicationResponse
    paymentMethod?: PaymentMethodResponse
    leadSource?: LeadSourceResponse
    reseller?: {
        id: string
        name: string
        email: string
    }
    payments?: ClientPayment[]
}


export type ClientPayment = {
    id?: string;
    amount: number;
    paidAt: string;
    dueDate: string;
    paymentMethodId: string;
    discount: number;
    surcharge: number;
    notes: string;
    sendReceipt?: boolean;
    renewClient?: boolean;
}




export type ClientList = ClientResponse[]




