// store/leadStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
} from '@/services/api-services'
import {
    LeadSourceResponse,
    LeadSourceCreate,
    LeadSourceUpdate,
} from '@/types/lead'

export const useLeadSourceStore = createGenericStore<LeadSourceResponse, LeadSourceCreate, LeadSourceUpdate>(
    'lead-sources',
    {
        fetchAll,
        fetchOne,
        createItem,
        updateItem,
        deleteItem,
    }
)
