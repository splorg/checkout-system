import { api } from "../api"
import { IEvent, IProduct } from "./types"

export class EventService {
  static getEvents = async () => {
    const { data } = await api.get<{ events: IEvent[] }>("/events")

    return data
  }

  static getProducts = async (eventId: string) => {
    const { data } = await api.get<{ products: IProduct[] }>(`/events/${eventId}/products`)

    return data
  }
}
