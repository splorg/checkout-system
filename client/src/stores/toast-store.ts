import { create } from 'zustand'

export interface IToast {
  id: number
  message: string
  type: 'success' | 'error'
  duration: number
}

interface ToastState {
  toasts: IToast[]
  addToast: (message: string, type: 'success' | 'error', duration?: number) => void
  removeToast: (id: number) => void
}

export const useToastStore = create<ToastState>()(
  (set) => ({
    toasts: [],
    addToast: (message, type, duration = 3000) =>
      set((state) => ({
        toasts: [
          ...state.toasts,
          { id: state.toasts.length + 1, message, type, duration },
        ],
      })),
    removeToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      })),
  })
)