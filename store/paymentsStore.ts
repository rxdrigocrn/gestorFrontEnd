// store/paymentsStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
} from '@/services/api-services'
import {
    Payment,
} from '@/types/payments'
import { api } from '@/services/api'

const baseStore = createGenericStore<Payment, any>(
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

