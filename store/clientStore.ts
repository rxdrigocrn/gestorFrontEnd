// useClientStore.ts
import { create } from 'zustand'
import {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
} from '@/services/api-services'
import {
    ClientCreate,
    ClientUpdate,
    ClientResponse,
    ClientList,
} from '@/types/client'

interface ClientStore {
    clients: ClientList
    isLoading: boolean
    error: string | null

    fetchClients: () => Promise<void>
    getClient: (id: string) => Promise<ClientResponse | null>
    createClient: (data: ClientCreate) => Promise<void>
    updateClient: (id: string, data: ClientUpdate) => Promise<void>
    deleteClient: (id: string) => Promise<void>
}

export const useClientStore = create<ClientStore>((set, get) => ({
    clients: [],
    isLoading: false,
    error: null,

    fetchClients: async () => {
        set({ isLoading: true, error: null })
        try {
            const clients: ClientList = await fetchAll('clients')
            set({ clients })
        } catch (err: any) {
            set({ error: err.message })
        } finally {
            set({ isLoading: false })
        }
    },

    getClient: async (id: string) => {
        try {
            return await fetchOne('clients', id)
        } catch (err) {
            console.error(err)
            return null
        }
    },

    createClient: async (data: ClientCreate) => {
        try {
            await createItem('clients', data)
            await get().fetchClients()
        } catch (err: any) {
            set({ error: err.message })
        }
    },

    updateClient: async (id: string, data: ClientUpdate) => {
        try {
            await updateItem('clients', id, data)
            await get().fetchClients()
        } catch (err: any) {
            set({ error: err.message })
        }
    },

    deleteClient: async (id: string) => {
        try {
            await deleteItem('clients', id)
            set({ clients: get().clients.filter((c) => c.id !== id) })
        } catch (err: any) {
            set({ error: err.message })
        }
    },
}))
