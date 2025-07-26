// lib/createGenericStore.ts
import { create } from 'zustand'

type GenericStore<TResponse, TCreate, TUpdate = TCreate> = {
    items: TResponse[]
    isLoading: boolean
    total: number
    error: string | null
    fetchItems: (query?: Record<string, any>) => Promise<void>
    getItem: (id: string) => Promise<TResponse | null>
    createItem: (data: TCreate) => Promise<void>
    updateItem: (id: string, data: TUpdate) => Promise<void>
    deleteItem: (id: string) => Promise<void>
}

export function createGenericStore<TResponse, TCreate, TUpdate = TCreate>(
    resource: string,
    api: {
        fetchAll: (resource: string, params?: any) => Promise<any>
        fetchOne: (resource: string, id: string) => Promise<TResponse>
        createItem: (resource: string, data: TCreate) => Promise<TResponse>
        updateItem: (resource: string, id: string, data: TUpdate) => Promise<TResponse>
        deleteItem: (resource: string, id: string) => Promise<void>
    },
    options?: {
        parseListResponse?: (data: any) => { items: TResponse[]; total: number }
    }
) {
    return create<GenericStore<TResponse, TCreate, TUpdate>>((set, get) => ({
        items: [],
        isLoading: false,
        error: null,
        total: 0,

        fetchItems: async (query = {}) => {
            set({ isLoading: true, error: null })
            try {
                const data = await api.fetchAll(resource, query)

                const parsed = options?.parseListResponse
                    ? options.parseListResponse(data)
                    : { items: data, total: Array.isArray(data) ? data.length : 0 }

                set({
                    items: parsed.items,
                    total: parsed.total,
                })
            } catch (err: any) {
                set({ error: err.message })
            } finally {
                set({ isLoading: false })
            }
        },

        getItem: async (id: string) => {
            try {
                return await api.fetchOne(resource, id)
            } catch (err) {
                console.error(err)
                return null
            }
        },

        createItem: async (data: TCreate) => {
            try {
                const newItem = await api.createItem(resource, data)
                set({ items: [...get().items, newItem] })
            } catch (err: any) {
                set({ error: err.message })
            }
        },

        updateItem: async (id: string, data: TUpdate) => {
            try {
                const updated = await api.updateItem(resource, id, data)
                set({
                    items: get().items.map((item) =>
                        (item as any).id === id ? updated : item
                    ),
                })
            } catch (err: any) {
                set({ error: err.message })
            }
        },

        deleteItem: async (id: string) => {
            try {
                await api.deleteItem(resource, id)
                set({
                    items: get().items.filter((item) => (item as any).id !== id),
                })
            } catch (err: any) {
                set({ error: err.message })
            }
        },
    }))
}
