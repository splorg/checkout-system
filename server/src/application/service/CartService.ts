import { Cart, CartStatus } from "@/domain/aggregate/Cart";
import type { Product } from "@/domain/entity/Product";
import {
	type CartCreatedEvent,
	type CartEventStore,
	createEvent,
} from "@/domain/event/CartEvent";
import { UUID } from "@/domain/value-object/UUID";

export class CartService {
	constructor(private readonly eventStore: CartEventStore) {}

	async findActiveCart(cartId: string): Promise<Cart | null> {
		const events = await this.eventStore.getCartEvents(cartId);

		if (!events.length) {
			return null;
		}

		const cart = Cart.fromEvents(events);

		return cart.getStatus() === CartStatus.ACTIVE ? cart : null;
	}

	async createNewCart(
		userId: string,
		eventId: string,
		product: Product,
		quantity: number,
	): Promise<Cart> {
		const cartId = UUID.create().getValue();

		const event = createEvent<CartCreatedEvent>(
			"CART_CREATED",
			{
				cartId,
				eventId,
				userId,
				firstItem: {
					productId: product.getId(),
					productName: product.getName(),
					quantity,
					price: product.getPrice(),
				},
			},
			1,
		);

		await this.eventStore.saveEvents(cartId, [event]);
		return Cart.create(event);
	}

	async addItemToCart(
		cart: Cart,
		product: Product,
		quantity: number,
	): Promise<Cart> {
		const event = cart.addItem(
			product.getId(),
			product.getName(),
			quantity,
			product.getPrice(),
		);
		await this.eventStore.saveEvents(cart.getId(), [event]);
		return cart;
	}

	async removeItemFromCart(cart: Cart, productId: string): Promise<Cart> {
		const event = cart.removeItem(productId);
		await this.eventStore.saveEvents(cart.getId(), [event]);
		return cart;
	}

	async abandonCart(cart: Cart): Promise<Cart> {
		const event = cart.abandon();
		await this.eventStore.saveEvents(cart.getId(), [event]);
		return cart;
	}

	async completeCart(cart: Cart, orderId: string): Promise<Cart> {
		const event = cart.complete(orderId);
		await this.eventStore.saveEvents(cart.getId(), [event]);
		return cart;
	}

	async getCurrentCart(userId: string, eventId: string): Promise<Cart | null> {
		const cartEvents = await this.eventStore.findCart(userId, eventId);

		if (!cartEvents) {
			return null;
		}

		return Cart.fromEvents(cartEvents);
	}
}
