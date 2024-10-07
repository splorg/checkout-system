import { create } from 'zustand'
import { ICartItem } from '../services/cart/types'

interface CartState {
  cartId: string
  cartItems: ICartItem[]
  setCartId: (id: string) => void
  setCartItems: (items: ICartItem[]) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  (set) => ({
    cartId: "",
    cartItems: [],
    setCartId: (id: string) => set({ cartId: id }),
    setCartItems: (items: ICartItem[]) => set({ cartItems: items }),
    clearCart: () => set({ cartId: "", cartItems: [] })
  })
)
