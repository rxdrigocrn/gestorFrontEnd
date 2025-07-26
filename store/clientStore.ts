// store/clientStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
} from '@/services/api-services'
import {
    ClientResponse,
    ClientCreate,
    ClientUpdate,
} from '@/types/client'
import { api } from '@/services/api'

// Cria store base com parseListResponse customizado para clients
const baseStore = createGenericStore<ClientResponse, ClientCreate, ClientUpdate>(
    'clients',
    {
        fetchAll,
        fetchOne,
        createItem,
        updateItem,
        deleteItem,
    },
    {
        parseListResponse: (data) => ({
            items: data.items,
            total: data.total,
        }),
    }
)

export const useClientStore = () => {
    const store = baseStore()

    const addPaymentToClient = async (clientId: string, data: any) => {
        const response = await api.post(`/payments/client/${clientId}`, data)
        return response.data
    }

    const updatePaymentToClient = async (paymentId: string, data: any) => {
        const response = await api.patch(`/payments/${paymentId}`, data)
        return response.data
    }

    const deletePaymentToClient = async (paymentId: string) => {
        const response = await api.delete(`/payments/${paymentId}`)
        return response.data
    }

    return {
        ...store,
        addPaymentToClient,
        updatePaymentToClient,
        deletePaymentToClient,
    }
}
