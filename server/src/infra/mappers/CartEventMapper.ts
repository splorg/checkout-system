import type {
	CartAbandonedEvent,
	CartCompletedEvent,
	CartCreatedEvent,
	CartEvent,
	CartItemAddedEvent,
	CartItemRemovedEvent,
} from "@/domain/event/CartEvent";
import type { DomainEvent, Prisma } from "@prisma/client";

export class CartEventMapper {
	static toDomain(prismaEvent: DomainEvent): CartEvent {
		const baseEvent = {
			id: prismaEvent.id,
			aggregateId: prismaEvent.aggregateId,
			version: prismaEvent.version,
			timestamp: prismaEvent.timestamp,
		};

		switch (prismaEvent.type) {
			case "CART_CREATED":
				return {
					...baseEvent,
					type: "CART_CREATED",
					data: prismaEvent.data as unknown as CartCreatedEvent["data"],
				};
			case "CART_ITEM_ADDED":
				return {
					...baseEvent,
					type: "CART_ITEM_ADDED",
					data: prismaEvent.data as unknown as CartItemAddedEvent["data"],
				};
			case "CART_ITEM_REMOVED":
				return {
					...baseEvent,
					type: "CART_ITEM_REMOVED",
					data: prismaEvent.data as unknown as CartItemRemovedEvent["data"],
				};
			case "CART_COMPLETED":
				return {
					...baseEvent,
					type: "CART_COMPLETED",
					data: prismaEvent.data as unknown as CartCompletedEvent["data"],
				};
			case "CART_ABANDONED":
				return {
					...baseEvent,
					type: "CART_ABANDONED",
					data: prismaEvent.data as unknown as CartAbandonedEvent["data"],
				};
			default:
				throw new Error(`Unknown cart event type: ${prismaEvent.type}`);
		}
	}
}
