export type PaymentMethodBase = {
  name: string
  feePercentage: number
  description?: string | null
}

export type PaymentMethodCreate = PaymentMethodBase

export type PaymentMethodUpdate = PaymentMethodBase & {
  id: string
}

export type PaymentMethodResponse = PaymentMethodBase & {
  id: string
  createdAt: string
  updatedAt: string
  organizationId: string
}

export type PaymentMethodList = PaymentMethodResponse[]
