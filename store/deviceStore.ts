// store/deviceStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
  fetchAll,
  fetchOne,
  createItem,
  updateItem,
  deleteItem,
} from '@/services/api-services'
import {
  DeviceResponse,
  DeviceCreate,
  DeviceUpdate,
} from '@/types/device'

export const useDeviceStore = createGenericStore<DeviceResponse, DeviceCreate, DeviceUpdate>(
  'devices',
  {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
  }
)
