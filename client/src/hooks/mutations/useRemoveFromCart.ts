import { useMutation } from "@tanstack/react-query"
import { CartService } from "../../services/cart"
import { ICart } from "../../services/cart/types"

interface Props {
  onSuccess: (data: { cart: ICart }) => void
  onError: () => void
}

export const useRemoveFromCart = ({ onSuccess, onError }: Props) => {
  return useMutation({
    mutationFn: CartService.removeItemFromCart,
    onSuccess,
    onError,
  })
}