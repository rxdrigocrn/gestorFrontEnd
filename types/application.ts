export type ApplicationBase = {
  name: string
  isDefault: boolean
}

export type ApplicationCreate = ApplicationBase

export type ApplicationUpdate = ApplicationBase & {
  id: string
}

export type ApplicationResponse = ApplicationBase & {
  id: string
  // createdAt: string
  // updatedAt: string
  organizationId: string
}

export type ApplicationList = ApplicationResponse[]
