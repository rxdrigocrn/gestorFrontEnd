import { createGenericStore } from '@/store/genericStore'
import {
    PaymentMethodResponse,
    PaymentMethodCreate,
    PaymentMethodUpdate,
} from '@/types/paymentMethod'
import * as api from '@/services/api-services'

export const usePaymentMethodStore = createGenericStore<
    PaymentMethodResponse,
    PaymentMethodCreate,
    PaymentMethodUpdate
>('payment-methods', {
    fetchAll: api.fetchAll,
    fetchOne: api.fetchOne,
    createItem: api.createItem,
    updateItem: api.updateItem,
    deleteItem: api.deleteItem,
}
)
