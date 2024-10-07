import { api } from "../api"
import { ICart, ICheckoutResult } from "./types"

interface AddItemProps {
  cartId: string
  productId: string
  quantity: number
}

interface RemoveItemProps {
  cartId: string
  productId: string
}

interface CompleteCheckoutProps {
  cartId: string
  eventId: string
  userId: string
}

export class CartService {
  static createCart = async (userId: string, eventId: string, productId: string, quantity: number) => {
    const { data } = await api.post<{ cart: ICart }>("/cart/create", {
      userId,
      eventId,
      productId,
      quantity,
    })

    return data
  }

  static addItemToCart = async ({ cartId, productId, quantity }: AddItemProps) => {
    const { data } = await api.post<{ cart: ICart }>("/cart/add", {
      cartId,
      productId,
      quantity,
    })

    return data
  }

  static removeItemFromCart = async ({cartId, productId }: RemoveItemProps) => {
    const { data } = await api.delete<{ cart: ICart }>(`/cart/${cartId}/${productId}`)

    return data
  }

  static getCurrentCart = async (userId: string, eventId: string) => {
    const { data } = await api.get<{ cart: ICart }>(`/cart/${userId}/${eventId}`)

    return data
  }

  static completeCheckout = async ({ cartId, userId, eventId }: CompleteCheckoutProps) => {
    const { data } = await api.post<ICheckoutResult>(`/cart/checkout`, {
      cartId,
      userId,
      eventId,
    })

    return data
  }
}
