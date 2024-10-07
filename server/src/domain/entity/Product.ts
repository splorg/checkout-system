import { Money } from "@/domain/value-object/Money";
import { UUID } from "@/domain/value-object/UUID";
import { InsufficientStockError } from "../errors";

export class Product {
	private readonly id: UUID;
	private readonly eventId: UUID;
	private name: string;
	private readonly price: Money;
	private stock: number;
	private readonly imageUrl: string | null;

	constructor(
		id: string,
		eventId: string,
		name: string,
		price: number,
		stock: number,
		imageUrl: string | null,
	) {
		this.id = new UUID(id);
		this.eventId = new UUID(eventId);
		this.name = name;
		this.price = Money.fromNumber(price);
		this.stock = stock;
		this.imageUrl = imageUrl;
	}

	static create(
		eventId: string,
		name: string,
		price: number,
		stock: number,
		imageUrl: string | null,
	) {
		const uuid = UUID.create();

		return new Product(uuid.getValue(), eventId, name, price, stock, imageUrl);
	}

	getId() {
		return this.id.getValue();
	}

	getEventId() {
		return this.eventId.getValue();
	}

	getName() {
		return this.name;
	}

	getPrice() {
		return this.price.getValue();
	}

	getStock() {
		return this.stock;
	}

	getImageUrl() {
		return this.imageUrl;
	}

	decreaseStock(quantity: number) {
		if (quantity > this.stock) {
			throw new InsufficientStockError(this.stock, quantity);
		}

		this.stock -= quantity;
	}

	isAvailable() {
		return this.stock > 0;
	}
}
