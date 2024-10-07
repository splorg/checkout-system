import type { Cart } from "@/domain/aggregate/Cart";
import type { Wallet } from "@/domain/aggregate/Wallet";
import type { Order } from "@/domain/entity/Order";
import type { OrderRepository } from "@/domain/repository/OrderRepository";
import type { Prisma, PrismaClient } from "@prisma/client";
import { OrderMapper } from "../mappers/OrderMapper";
import { WalletEventMapper } from "../mappers/WalletEventMapper";

export class PrismaOrderRepository implements OrderRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async findByUserId(userId: string): Promise<Order[]> {
		const ordersData = await this.prisma.order.findMany({
			where: { userId: userId },
			orderBy: { createdAt: "desc" },
			include: { items: true },
		});

		const orders: Order[] = [];

		for (const orderData of ordersData) {
			orders.push(OrderMapper.toDomain(orderData, orderData.items));
		}

		return orders;
	}

	async performCheckout(
		cart: Cart,
		wallet: Wallet,
		order: Order,
	): Promise<{ success: boolean; message: string; orderId?: string }> {
		try {
			return await this.prisma.$transaction(async (tx) => {
				const unavailableItems = await this.checkAvailabilityAndUpdateStock(
					tx,
					cart,
				);

				if (unavailableItems.length) {
					await this.handleUnavailableItems(tx, cart, unavailableItems);
					return { success: false, message: "Some products are unavailable" };
				}

				const createdOrder = await this.createOrder(tx, cart, order);
				const debitedWallet = await this.debitWallet(tx, wallet, order);
				await this.completeCart(tx, cart, order.getId());

				return {
					success: true,
					message: "Checkout completed successfully",
					orderId: createdOrder.id,
					remainingBalance: debitedWallet.getBalance().getValue(),
				};
			});
		} catch (error) {
			console.error("Checkout failed: ", error);
			return {
				success: false,
				message: "Checkout failed due to an internal error",
			};
		}
	}

	private async checkAvailabilityAndUpdateStock(
		tx: Prisma.TransactionClient,
		cart: Cart,
	): Promise<string[]> {
		const unavailableItems: string[] = [];

		const productIds = cart.getItems().map((item) => item.getProductId());
		const products = await tx.product.findMany({
			where: { id: { in: productIds } },
		});

		const productStockMap = new Map(
			products.map((product) => [product.id, product.stock]),
		);

		for (const item of cart.getItems()) {
			const stock = productStockMap.get(item.getProductId()) || 0;

			if (stock < item.getQuantity()) {
				unavailableItems.push(item.getProductId());
			} else {
				productStockMap.set(item.getProductId(), stock - item.getQuantity());
			}
		}

		if (unavailableItems.length === 0) {
			await Promise.all(
				cart.getItems().map((item) =>
					tx.product.update({
						where: { id: item.getProductId() },
						data: { stock: productStockMap.get(item.getProductId()) },
					}),
				),
			);
		}

		return unavailableItems;
	}

	private async handleUnavailableItems(
		tx: Prisma.TransactionClient,
		cart: Cart,
		unavailableItems: string[],
	) {
		for (const itemId of unavailableItems) {
			const event = cart.removeItem(itemId);

			await tx.domainEvent.create({
				data: {
					id: event.id,
					aggregateId: cart.getId(),
					aggregateType: "CART",
					type: event.type,
					data: event.data as unknown as Prisma.JsonObject,
					version: event.version,
					timestamp: event.timestamp,
				},
			});
		}
	}

	private async createOrder(
		tx: Prisma.TransactionClient,
		cart: Cart,
		order: Order,
	) {
		const createdOrder = await tx.order.create({
			data: {
				id: order.getId(),
				total: cart.getTotal().getValue(),
				userId: order.getUserId(),
				eventId: order.getEventId(),
				items: {
					createMany: {
						data: order.getItems().map((item) => ({
							productId: item.productId,
							productName: item.productName,
							quantity: item.quantity,
							price: item.price.getValue(),
						})),
					},
				},
			},
		});

		return createdOrder;
	}

	private async debitWallet(
		tx: Prisma.TransactionClient,
		wallet: Wallet,
		order: Order,
	) {
		const debitEvent = wallet.debit(order.getTotal());
		const debitPersistenceEvent = WalletEventMapper.toPersistence(debitEvent);

		await tx.domainEvent.create({
			data: {
				id: debitPersistenceEvent.id,
				aggregateId: wallet.getId(),
				aggregateType: "WALLET",
				type: debitPersistenceEvent.type,
				data: debitPersistenceEvent.data as Prisma.JsonObject,
				version: debitPersistenceEvent.version,
				timestamp: debitPersistenceEvent.timestamp,
			},
		});

		return wallet;
	}

	private async completeCart(
		tx: Prisma.TransactionClient,
		cart: Cart,
		orderId: string,
	) {
		const completedEvent = cart.complete(orderId);

		await tx.domainEvent.create({
			data: {
				id: completedEvent.id,
				aggregateId: cart.getId(),
				aggregateType: "CART",
				type: completedEvent.type,
				data: completedEvent.data as unknown as Prisma.JsonObject,
				version: completedEvent.version,
				timestamp: completedEvent.timestamp,
			},
		});
	}
}
