// lib/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // se backend usar cookie para auth, mantém
})

// Intercepta 401 no client (não roda no SSR)
if (typeof window !== 'undefined') {
  api.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  )
}
