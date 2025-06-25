export type ServerBase = {
  name: string
  cost: number
  credits: number | null
  panelLink: string
  whatsappSession: string | null
  androidAppUrl: string | null
  androidAppUrlSec: string | null
  iosAppUrl: string | null
  samsungAppUrl: string | null
  lgAppUrl: string | null
  rokuAppUrl: string | null
}

export type ServerCreate = ServerBase

export type ServerUpdate = ServerBase & {
  id: string
}

export type ServerResponse = ServerBase & {
  id: string
  createdAt: string
  updatedAt: string
  organizationId: string
}

export type ServerList = ServerResponse[]
