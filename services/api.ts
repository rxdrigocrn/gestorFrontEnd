// lib/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true, // apenas se cookies forem necessários
})

// Intercepta todas as requisições e adiciona o token
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

// Intercepta 401 e redireciona para login
// if (typeof window !== 'undefined') {
//   api.interceptors.response.use(
//     (res) => res,
//     (err) => {
//       if (err.response?.status === 401) {
//         window.location.href = '/auth/login'
//       }
//       return Promise.reject(err)
//     }
//   )
// }
