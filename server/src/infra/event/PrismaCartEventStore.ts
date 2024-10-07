import type { CartEvent, CartEventStore } from "@/domain/event/CartEvent";
import type { Prisma, PrismaClient } from "@prisma/client";
import { CartEventMapper } from "../mappers/CartEventMapper";

export class PrismaCartEventStore implements CartEventStore {
	constructor(private readonly prisma: PrismaClient) {}

	async getCartEvents(cartId: string): Promise<CartEvent[]> {
		const eventsData = await this.prisma.domainEvent.findMany({
			where: {
				aggregateType: "CART",
				aggregateId: cartId,
			},
			orderBy: {
				version: "asc",
			},
		});

		return eventsData.map(CartEventMapper.toDomain);
	}

	async saveEvents(aggregateId: string, events: CartEvent[]): Promise<void> {
		await this.prisma.domainEvent.createMany({
			data: events.map((event) => ({
				id: event.id,
				aggregateId: aggregateId,
				aggregateType: "CART",
				type: event.type,
				data: event.data as unknown as Prisma.JsonObject,
				version: event.version,
				timestamp: event.timestamp,
			})),
		});
	}

	async getEvents(aggregateId: string): Promise<CartEvent[]> {
		const eventsData = await this.prisma.domainEvent.findMany({
			where: {
				aggregateId: aggregateId,
				aggregateType: "CART",
			},
			orderBy: {
				version: "asc",
			},
		});

		return eventsData.map(CartEventMapper.toDomain);
	}

	async findCart(userId: string, eventId: string): Promise<CartEvent[] | null> {
		const latestCartEvent = await this.prisma.domainEvent.findFirst({
			where: {
				aggregateType: "CART",
				type: {
					in: ["CART_CREATED", "CART_COMPLETED"],
				},
				AND: [
					{
						data: {
							path: "$.userId",
							equals: userId,
						},
					},
					{
						data: {
							path: "$.eventId",
							equals: eventId,
						},
					},
				],
			},
			orderBy: {
				timestamp: "desc",
			},
		});

		if (!latestCartEvent || latestCartEvent.type === "CART_COMPLETED") {
			return null;
		}

		const allCartEvents = await this.prisma.domainEvent.findMany({
			where: {
				aggregateType: "CART",
				aggregateId: latestCartEvent.aggregateId,
			},
			orderBy: {
				version: "asc",
			},
		});

		return allCartEvents.map(CartEventMapper.toDomain);
	}
}
