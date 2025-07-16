// store/billingRulesStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
} from '@/services/api-services'
import {
    BillingRuleResponse,
    BillingRuleCreate,
    BillingRuleUpdate,
} from '@/types/billingRules'

export const useBillingRuleStore = createGenericStore<BillingRuleResponse, BillingRuleCreate, BillingRuleUpdate>(
    'billing-rules',
    {
        fetchAll,
        fetchOne,
        createItem,
        updateItem,
        deleteItem,
    }
)

