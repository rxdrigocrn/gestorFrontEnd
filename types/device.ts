export type DeviceBase = {
  name: string
  isDefault: boolean
}

export type DeviceCreate = DeviceBase

export type DeviceUpdate = DeviceBase & {
  id: string
}

export type DeviceResponse = DeviceBase & {
  id: string
  // createdAt: string
  // updatedAt: string
  organizationId: string
}

export type DeviceList = DeviceResponse[]
