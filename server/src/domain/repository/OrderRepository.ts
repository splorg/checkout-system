import type { CheckoutResultDTO } from "@/application/dto/CheckoutResult";
import type { Cart } from "../aggregate/Cart";
import type { Wallet } from "../aggregate/Wallet";
import type { Order } from "../entity/Order";

export interface OrderRepository {
	performCheckout(
		cart: Cart,
		wallet: Wallet,
		order: Order,
	): Promise<CheckoutResultDTO>;
	findByUserId(userId: string): Promise<Order[]>;
}
