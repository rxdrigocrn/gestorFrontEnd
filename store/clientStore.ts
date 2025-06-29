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

export const useClientStore = createGenericStore<ClientResponse, ClientCreate, ClientUpdate>(
    'clients',
    {
        fetchAll,
        fetchOne,
        createItem,
        updateItem,
        deleteItem,
    }
)

