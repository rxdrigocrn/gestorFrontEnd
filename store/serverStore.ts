// store/serverStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
} from '@/services/api-services'
import {
    ServerResponse,
    ServerCreate,
    ServerUpdate,
} from '@/types/server'

export const useServerStore = createGenericStore<ServerResponse, ServerCreate, ServerUpdate>(
    'servers',
    {
        fetchAll,
        fetchOne,
        createItem,
        updateItem,
        deleteItem,
    }
)
