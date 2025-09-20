// store/paymentsStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
} from '@/services/api-services'
import { ClientPaymentResponse } from '@/types/client'
import { api } from '@/services/api'

const baseStore = createGenericStore<ClientPaymentResponse, any>(
    'payments',
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

export const usePaymentStore = () => {
    const store = baseStore()

    return {
        ...store,
    }
}

