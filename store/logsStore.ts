// store/logsStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
} from '@/services/api-services'
import {
    Log,
} from '@/types/logs'
import { api } from '@/services/api'

const baseStore = createGenericStore<Log, any>(
    'activity-logs',
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

export const useLogStore = () => {
    const store = baseStore()

    return {
        ...store,
    }
}

