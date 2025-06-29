export type ServerBase = {
  name: string
  cost: number
  credits?: number | null
  panelLink: string
  whatsappSession?: string 
  androidAppUrl?: string 
  androidAppUrlSec?: string 
  iosAppUrl?: string 
  samsungAppUrl?: string 
  lgAppUrl?: string 
  rokuAppUrl?: string 
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

