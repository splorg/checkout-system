import { useQuery } from "@tanstack/react-query"
import { EventService } from "../../services/event"

export const GET_EVENTS_QUERY_KEY = "getEvents"

export const useGetEvents = () => {
  return useQuery({
    queryKey: [GET_EVENTS_QUERY_KEY],
    queryFn: EventService.getEvents,
  })
}
