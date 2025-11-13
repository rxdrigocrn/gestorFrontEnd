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


async function extractErrorMessage(err: any): Promise<string> {
    if (!err) return 'Erro desconhecido'

    // Caso seja um erro do Axios
    if (err.response) {
        const data = err.response.data
        const message =
            data?.message ||
            data?.error ||
            data?.errors ||
            data?.detail ||
            err.message

        if (Array.isArray(message)) return message.join(', ')
        if (typeof message === 'string') return message
        return `${err.response.status} - ${err.response.statusText || 'Erro na requisição'}`
    }

    // Caso seja um Response (fetch)
    if (err instanceof Response) {
        try {
            const data = await err.json()
            const message =
                data?.message ||
                data?.error ||
                data?.errors ||
                data?.detail ||
                `${err.status} - ${err.statusText}`
            if (Array.isArray(message)) return message.join(', ')
            if (typeof message === 'string') return message
            return `${err.status} - ${err.statusText}`
        } catch {
            return `${err.status} - ${err.statusText}`
        }
    }

    // Caso genérico (erro normal)
    const message =
        err?.message ||
        err?.error ||
        err?.data?.message ||
        err?.response?.data?.message ||
        'Erro desconhecido'

    if (Array.isArray(message)) return message.join(', ')
    if (typeof message === 'string') return message
    return 'Erro desconhecido'
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

                set({ items: parsed.items, total: parsed.total })
            } catch (err: any) {
                const message = await extractErrorMessage(err)
                set({ error: message })
                throw new Error(message)
            } finally {
                set({ isLoading: false })
            }
        },

        getItem: async (id: string) => {
            try {
                return await api.fetchOne(resource, id)
            } catch (err: any) {
                const message = await extractErrorMessage(err)
                set({ error: message })
                throw new Error(message)
            }
        },

        createItem: async (data: TCreate) => {
            try {
                const newItem = await api.createItem(resource, data)
                set({ items: [...get().items, newItem] })
            } catch (err: any) {
                const message = await extractErrorMessage(err)
                // Do not set the shared `error` state for mutations (create)
                // Mutations should surface errors to the caller and not overwrite
                // the store-level fetch error which is used by list UI components.
                throw new Error(message)
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
                const message = await extractErrorMessage(err)
                // Do not set the shared `error` state for mutations (update)
                throw new Error(message)
            }
        },


        deleteItem: async (id: string) => {
            try {
                await api.deleteItem(resource, id)
                set({
                    items: get().items.filter((item) => (item as any).id !== id),
                })
            } catch (err: any) {
                const message = await extractErrorMessage(err)
                // Do not set the shared `error` state for mutations (delete)
                throw new Error(message)
            }
        },
    }))
}
