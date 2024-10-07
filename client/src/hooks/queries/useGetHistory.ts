import { useQuery } from "@tanstack/react-query"
import { OrderService } from "../../services/order"

export const GET_HISTORY_QUERY_KEY = "getHistory"

export const useGetHistory = (userId: string) => {
  return useQuery({
    queryKey: [GET_HISTORY_QUERY_KEY],
    queryFn: () => OrderService.getOrderHistory(userId),
  })
}