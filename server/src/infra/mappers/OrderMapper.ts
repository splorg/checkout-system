import { Order } from "@/domain/entity/Order";
import { Money } from "@/domain/value-object/Money";
import type { OrderItem, Order as PrismaOrder } from "@prisma/client";

export class OrderMapper {
	static toDomain(order: PrismaOrder, items: OrderItem[]): Order {
		return new Order(
			order.id,
			order.userId,
			order.eventId,
			order.createdAt,
			items.map((item) => ({
				productId: item.productId,
				productName: item.productName,
				quantity: item.quantity,
				price: Money.fromNumber(item.price),
			})),
		);
	}
}
