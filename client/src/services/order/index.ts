import { api } from "../api";
import { IOrder } from "./types";

export class OrderService {
  static async getOrderHistory(userId: string) {
    const { data } = await api.get<{ orders: IOrder[]}>(`/orders/${userId}`);

    return data
  }
}