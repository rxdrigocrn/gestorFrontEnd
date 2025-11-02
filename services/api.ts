import axios from 'axios'
import { useSubscriptionModalStore } from '@/store/subscriptionModalStore'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://34.237.173.84",
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
        import('@/store/subscriptionModalStore').then(({ useSubscriptionModalStore }) => {
          useSubscriptionModalStore.getState().openModal()
        })
      }
      return Promise.reject(err)
    }
  )
}
