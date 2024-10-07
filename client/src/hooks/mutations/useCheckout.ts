import { useMutation } from "@tanstack/react-query"
import { CartService } from "../../services/cart"
import { ICheckoutResult } from "../../services/cart/types"

interface Props {
  onSuccess: (data: ICheckoutResult) => void
  onError: () => void
}

export const useCheckout = ({ onSuccess, onError }: Props) => {
  return useMutation({
    mutationFn: CartService.completeCheckout,
    onSuccess,
    onError,
  })
}