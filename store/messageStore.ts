// store/messageStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
} from '@/services/api-services'
import {
    MessageTemplateResponse,
    MessageTemplateCreate,
    MessageTemplateUpdate,
} from '@/types/message'

export const useMessageStore = createGenericStore<MessageTemplateResponse, MessageTemplateCreate, MessageTemplateUpdate>(
    'message-templates',
    {
        fetchAll,
        fetchOne,
        createItem,
        updateItem,
        deleteItem,
    }
)

