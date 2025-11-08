// store/subscriptionModalStore.ts
import { create } from 'zustand'

interface SubscriptionModalStore {
  open: boolean
  message: string | null // 👈 Adicionado para guardar a mensagem
  openModal: (message: string) => void // 👈 Modificado para aceitar uma mensagem
  closeModal: () => void
}

export const useSubscriptionModalStore = create<SubscriptionModalStore>((set) => ({
  open: false,
  message: null, // 👈 Valor inicial
  openModal: (message) => set({ open: true, message }), // 👈 Atualiza o estado com a mensagem
  closeModal: () => set({ open: false, message: null }), // 👈 Limpa a mensagem ao fechar
}))