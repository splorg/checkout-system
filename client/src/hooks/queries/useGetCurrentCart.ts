import { useQuery } from "@tanstack/react-query"
import { CartService } from "../../services/cart"

export const GET_CURRENT_CART_QUERY_KEY = "getCurrentCart"

export const useGetCurrentCart = (userId: string, eventId: string) => {
  return useQuery({
    queryKey: [userId, eventId, GET_CURRENT_CART_QUERY_KEY],
    queryFn: () => CartService.getCurrentCart(userId, eventId),
    enabled: !!eventId
  })
}
