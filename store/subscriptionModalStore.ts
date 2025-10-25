// store/subscriptionModalStore.ts
import { create } from 'zustand'

interface SubscriptionModalStore {
  open: boolean
  openModal: () => void
  closeModal: () => void
}

export const useSubscriptionModalStore = create<SubscriptionModalStore>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}))
