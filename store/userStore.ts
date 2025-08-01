// store/userStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
  fetchAll,
  fetchOne,
  createItem,
  updateItem,
  deleteItem,
} from '@/services/api-services'
import {
  UserResponse,
  UserCreate,
  UserUpdate,
} from '@/types/user'

export const useUserStore = createGenericStore<UserResponse, UserCreate, UserUpdate>(
  'users',
  {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
  }
)

