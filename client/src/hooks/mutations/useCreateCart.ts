import { useMutation } from "@tanstack/react-query"
import { CartService } from "../../services/cart"
import { ICart } from "../../services/cart/types"

interface Props {
  userId: string
  eventId: string
  productId: string
  quantity: number
  onSuccess: (data: { cart: ICart }) => void
  onError: () => void
}

export const useCreateCart = ({ userId, eventId, productId, quantity, onSuccess, onError }: Props) => {
  return useMutation({
    mutationFn: () => CartService.createCart(userId, eventId, productId, quantity),
    onSuccess,
    onError,
  })
}