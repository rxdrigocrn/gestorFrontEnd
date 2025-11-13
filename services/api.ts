import axios from 'axios'
import { useSubscriptionModalStore } from '@/store/subscriptionModalStore'

export const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://http://localhost:5000",
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)


if (typeof window !== 'undefined') {
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 403) {
        const errorMessage =
          err.response?.data?.message || 
          'A sua subscrição não está ativa. Por favor, complete o pagamento.'

        import('@/store/subscriptionModalStore').then(
          ({ useSubscriptionModalStore }) => {
            // Passa a mensagem de erro para a store
            useSubscriptionModalStore.getState().openModal(errorMessage) // 👈 Modificado
          }
        )
      }
      return Promise.reject(err)
    }
  )
}
