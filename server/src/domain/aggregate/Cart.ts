import {
	CartItemNotFoundError,
	CartStatusError,
	UnableToRecreateAggregateError,
	UnknownEventError,
} from "../errors";
import {
	type CartAbandonedEvent,
	type CartCompletedEvent,
	type CartCreatedEvent,
	type CartEvent,
	type CartItemAddedEvent,
	type CartItemRemovedEvent,
	createEvent,
	isCartAbandonedEvent,
	isCartCompletedEvent,
	isCartCreatedEvent,
	isCartItemAddedEvent,
	isCartItemRemovedEvent,
} from "../event/CartEvent";
import { CartItem } from "../value-object/CartItem";
import { Money } from "../value-object/Money";
import { UUID } from "../value-object/UUID";

export enum CartStatus {
	ACTIVE = "ACTIVE",
	ABANDONED = "ABANDONED",
	COMPLETED = "COMPLETED",
}

export class Cart {
	private items: Map<string, CartItem> = new Map();
	private status: CartStatus = CartStatus.ACTIVE;
	private version = 0;
	private lastActiveAt: Date = new Date();

	private constructor(
		private readonly id: UUID,
		private readonly eventId: UUID,
		private readonly userId: UUID,
	) {}

	static create(event: CartCreatedEvent) {
		const cart = new Cart(
			new UUID(event.data.cartId),
			new UUID(event.data.eventId),
			new UUID(event.data.userId),
		);

		cart.apply(event);
		return cart;
	}

	static fromEvents(events: CartEvent[]) {
		if (!events.length) {
			throw new UnableToRecreateAggregateError(
				"CART",
				"No events to recreate cart!",
			);
		}

		const firstEvent = events[0];

		if (!isCartCreatedEvent(firstEvent)) {
			throw new UnableToRecreateAggregateError(
				"CART",
				"First event must be a CART_CREATED event",
			);
		}

		const cart = Cart.create(firstEvent);

		for (const event of events.slice(1)) {
			cart.apply(event);
		}

		return cart;
	}

	private apply(event: CartEvent) {
		if (isCartCreatedEvent(event)) {
			return this.applyCartCreated(event);
		}

		if (isCartItemAddedEvent(event)) {
			return this.applyCartItemAdded(event);
		}

		if (isCartItemRemovedEvent(event)) {
			return this.applyCartItemRemoved(event);
		}

		if (isCartAbandonedEvent(event)) {
			return this.applyCartAbandoned(event);
		}

		if (isCartCompletedEvent(event)) {
			return this.applyCartCompleted(event);
		}

		throw new UnknownEventError("CART");
	}

	private applyCartCreated(event: CartCreatedEvent) {
		const { productId, productName, quantity, price } = event.data.firstItem;

		this.items.set(
			productId,
			new CartItem(
				new UUID(productId),
				productName,
				quantity,
				Money.fromNumber(price),
			),
		);

		this.version = event.version;
		this.lastActiveAt = event.timestamp;
	}

	private applyCartItemAdded(event: CartItemAddedEvent) {
		const { productId, productName, quantity, price } = event.data.item;
		const existingItem = this.items.get(productId);

		if (existingItem) {
			existingItem.increaseQuantity(quantity);
		} else {
			this.items.set(
				productId,
				new CartItem(
					new UUID(productId),
					productName,
					quantity,
					Money.fromNumber(price),
				),
			);
		}

		this.version = event.version;
		this.lastActiveAt = event.timestamp;
	}

	private applyCartItemRemoved(event: CartItemRemovedEvent) {
		const { productId } = event.data;
		const itemToRemove = this.items.get(productId);

		if (!itemToRemove) {
			throw new CartItemNotFoundError(productId);
		}

		itemToRemove.decreaseQuantity(1);

		if (itemToRemove.getQuantity() === 0) {
			this.items.delete(productId);
		}

		this.version = event.version;
		this.lastActiveAt = event.timestamp;
	}

	private applyCartAbandoned(event: CartAbandonedEvent) {
		this.status = CartStatus.ABANDONED;

		this.version = event.version;
		this.lastActiveAt = event.timestamp;
	}

	private applyCartCompleted(event: CartCompletedEvent) {
		this.status = CartStatus.COMPLETED;

		this.version = event.version;
		this.lastActiveAt = event.timestamp;
	}

	addItem(
		productId: string,
		productName: string,
		quantity: number,
		price: number,
	): CartItemAddedEvent {
		if (this.status !== CartStatus.ACTIVE) {
			throw new CartStatusError("Cannot add item to inactive cart");
		}

		const event = createEvent<CartItemAddedEvent>(
			"CART_ITEM_ADDED",
			{
				cartId: this.getId(),
				eventId: this.getEventId(),
				userId: this.getUserId(),
				item: {
					productId,
					productName,
					quantity,
					price,
				},
			},
			this.version + 1,
		);

		this.apply(event);

		return event;
	}

	removeItem(productId: string): CartItemRemovedEvent {
		if (this.status !== CartStatus.ACTIVE) {
			throw new CartStatusError("Cannot remove item from inactive cart");
		}

		const event = createEvent<CartItemRemovedEvent>(
			"CART_ITEM_REMOVED",
			{
				cartId: this.getId(),
				eventId: this.getEventId(),
				userId: this.getUserId(),
				productId,
			},
			this.version + 1,
		);

		this.apply(event);

		return event;
	}

	abandon(): CartAbandonedEvent {
		if (this.status === CartStatus.COMPLETED) {
			throw new CartStatusError("Cart is already completed");
		}

		if (this.status === CartStatus.ABANDONED) {
			throw new CartStatusError("Cart is already abandoned");
		}

		const event = createEvent<CartAbandonedEvent>(
			"CART_ABANDONED",
			{
				cartId: this.getId(),
				eventId: this.getEventId(),
				userId: this.getUserId(),
				lastActiveAt: this.lastActiveAt,
			},
			this.version + 1,
		);

		this.apply(event);

		return event;
	}

	complete(orderId: string): CartCompletedEvent {
		if (this.status !== CartStatus.ACTIVE) {
			throw new CartStatusError("Cannot complete inactive cart");
		}

		const event = createEvent<CartCompletedEvent>(
			"CART_COMPLETED",
			{
				cartId: this.getId(),
				eventId: this.getEventId(),
				userId: this.getUserId(),
				orderId,
			},
			this.version + 1,
		);

		this.apply(event);

		return event;
	}

	getId(): string {
		return this.id.getValue();
	}

	getEventId(): string {
		return this.eventId.getValue();
	}

	getUserId(): string {
		return this.userId.getValue();
	}

	getStatus(): CartStatus {
		return this.status;
	}

	isEmpty(): boolean {
		return this.items.size === 0;
	}

	getTotal(): Money {
		let total = Money.fromNumber(0);

		for (const item of this.items.values()) {
			total = total.add(item.getTotal());
		}

		return total;
	}

	getItems() {
		return [...this.items.values()];
	}

	getItem(productId: string): CartItem | undefined {
		return this.items.get(productId);
	}
}
