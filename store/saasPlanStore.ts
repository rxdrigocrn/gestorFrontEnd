import { createGenericStore } from '@/store/genericStore';
import {
  fetchAll,
  fetchOne,
  createItem,
  updateItem,
  deleteItem,
} from '@/services/api-services';
import {
  SaaSPlanResponse,
  SaaSPlanCreate,
  SaaSPlanUpdate,
} from '@/types/saasPlan'; // Tipos que criaremos a seguir

export const useSaasPlanStore = createGenericStore<SaaSPlanResponse, SaaSPlanCreate, SaaSPlanUpdate>(
  'saas-plans', 
  {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
  }
);