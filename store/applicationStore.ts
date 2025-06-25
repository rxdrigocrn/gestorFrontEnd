// store/applicationStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
  fetchAll,
  fetchOne,
  createItem,
  updateItem,
  deleteItem,
} from '@/services/api-services'
import {
  ApplicationResponse,
  ApplicationCreate,
  ApplicationUpdate,
} from '@/types/application'

export const useApplicationStore = createGenericStore<ApplicationResponse, ApplicationCreate, ApplicationUpdate>(
  'applications',
  {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
  }
)
