import { UUID } from "../value-object/UUID";
import type { BaseEvent } from "./BaseEvent";
import type { EventStore } from "./EventStore";

interface CartEventBase {
	cartId: string;
	eventId: string;
	userId: string;
}

export interface CartCreatedEvent
	extends BaseEvent<
		CartEventBase & {
			firstItem: {
				productId: string;
				productName: string;
				quantity: number;
				price: number;
			};
		}
	> {
	type: "CART_CREATED";
}

export interface CartItemAddedEvent
	extends BaseEvent<
		CartEventBase & {
			item: {
				productId: string;
				productName: string;
				quantity: number;
				price: number;
			};
		}
	> {
	type: "CART_ITEM_ADDED";
}

export interface CartItemRemovedEvent
	extends BaseEvent<
		CartEventBase & {
			productId: string;
		}
	> {
	type: "CART_ITEM_REMOVED";
}

export interface CartAbandonedEvent
	extends BaseEvent<
		CartEventBase & {
			lastActiveAt: Date;
		}
	> {
	type: "CART_ABANDONED";
}

export interface CartCompletedEvent
	extends BaseEvent<
		CartEventBase & {
			orderId: string;
		}
	> {
	type: "CART_COMPLETED";
}

export type CartEvent =
	| CartCreatedEvent
	| CartItemAddedEvent
	| CartItemRemovedEvent
	| CartAbandonedEvent
	| CartCompletedEvent;

export interface CartEventStore extends EventStore<CartEvent> {
	getCartEvents(cartId: string): Promise<CartEvent[]>;
	findCart(userId: string, eventId: string): Promise<CartEvent[] | null>;
}

export function createEvent<T extends CartEvent>(
	type: T["type"],
	data: T["data"],
	version: number,
	timestamp: Date = new Date(),
	id: string = UUID.create().getValue(),
): T {
	return { type, data, version, timestamp, id } as T;
}

export function isCartCreatedEvent(
	event: CartEvent,
): event is CartCreatedEvent {
	return event.type === "CART_CREATED";
}

export function isCartItemAddedEvent(
	event: CartEvent,
): event is CartItemAddedEvent {
	return event.type === "CART_ITEM_ADDED";
}

export function isCartItemRemovedEvent(
	event: CartEvent,
): event is CartItemRemovedEvent {
	return event.type === "CART_ITEM_REMOVED";
}

export function isCartAbandonedEvent(
	event: CartEvent,
): event is CartAbandonedEvent {
	return event.type === "CART_ABANDONED";
}

export function isCartCompletedEvent(
	event: CartEvent,
): event is CartCompletedEvent {
	return event.type === "CART_COMPLETED";
}
