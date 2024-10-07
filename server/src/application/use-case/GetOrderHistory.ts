import type { Order } from "@/domain/entity/Order";
import type { OrderRepository } from "@/domain/repository/OrderRepository";
import type { OrderHistoryDTO } from "../dto/OrderHistory";

export class GetOrderHistory {
	constructor(private readonly orderRepository: OrderRepository) {}

	async execute(userId: string): Promise<OrderHistoryDTO> {
		const orders = await this.orderRepository.findByUserId(userId);

		return this.toDTO(orders);
	}

	private toDTO(orders: Order[]): OrderHistoryDTO {
		return {
			orders: orders.map((order) => ({
				orderId: order.getId(),
				total: order.getTotal().getValue(),
				date: order.getDate(),
				items: order.getItems().map((item) => ({
					productId: item.productId,
					productName: item.productName,
					quantity: item.quantity,
					price: item.price.getValue(),
				})),
			})),
		};
	}
}
