// store/saasPlanStore.ts
import { createGenericStore } from '@/store/genericStore'
import {
  fetchAll,
  fetchOne,
  createItem,
  updateItem,
  deleteItem,
} from '@/services/api-services'
import {
  SaaSPlanResponse,
  SaaSPlanCreate,
  SaaSPlanUpdate,
} from '@/types/saasPlan'
import { PaymentMethod } from '@/types/billings'

const baseStore = createGenericStore<SaaSPlanResponse, SaaSPlanCreate, SaaSPlanUpdate>(
  'saas-plans',
  {
    fetchAll,
    fetchOne,
    createItem,
    updateItem,
    deleteItem,
  },
)

export const useSaasPlanStore = () => {
  const store = baseStore()

  // 🔥 Novo handleCheckout
  const handleCheckout = async (saasPlanId: string, paymentMethod: PaymentMethod) => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) throw new Error('Usuário não autenticado.')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ saasPlanId, paymentMethod }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Erro ao criar checkout: ${errorText}`)
      }

      const session = await res.json()
      if (session?.url) {
        window.location.href = session.url
      } else {
        console.error('Nenhuma URL de checkout retornada:', session)
      }
    } catch (err) {
      console.error('Erro no checkout:', err)
      throw err
    }
  }

  return {
    ...store,
    handleCheckout,
  }
}
