export type LeadSourceBase = {
  type: string
  cost: number
  description?: string | null
  isDefault?: boolean
}

export type LeadSourceCreate = LeadSourceBase

export type LeadSourceUpdate = LeadSourceBase & {
  id: string
}

export type LeadSourceResponse = LeadSourceBase & {
  id: string
  createdAt: string
  updatedAt: string
  organizationId: string
}

export type LeadSourceList = LeadSourceResponse[]
