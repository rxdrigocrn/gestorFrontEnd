import { createGenericStore } from '@/store/genericStore'
import { PlanResponse, PlanCreate } from '@/types/plan'
import * as api from '@/services/api-services' // onde estão as funções fetchAll, fetchOne etc.

export const usePlanStore = createGenericStore<PlanResponse, PlanCreate>(
    'plans',
    {
        fetchAll: api.fetchAll,
        fetchOne: api.fetchOne,
        createItem: api.createItem,
        updateItem: api.updateItem,
        deleteItem: api.deleteItem,
    }
)
