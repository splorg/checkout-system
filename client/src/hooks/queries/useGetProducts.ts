import { useQuery } from "@tanstack/react-query"
import { EventService } from "../../services/event"

export const GET_PRODUCT_QUERY_KEY = "getProducts"

export const useGetProducts = (eventId: string) => {
  return useQuery({
    queryKey: [eventId, GET_PRODUCT_QUERY_KEY],
    queryFn: () => EventService.getProducts(eventId),
  })
}
