import { Money } from "../value-object/Money";
import { UUID } from "../value-object/UUID";

export interface OrderItem {
	productId: string;
	productName: string;
	quantity: number;
	price: Money;
}

export class Order {
	private id: UUID;
	private userId: UUID;
	private eventId: UUID;
	private date: Date;
	private items: OrderItem[];

	constructor(
		id: string,
		userId: string,
		eventId: string,
		date: Date,
		items: OrderItem[],
	) {
		this.id = new UUID(id);
		this.userId = new UUID(userId);
		this.eventId = new UUID(eventId);
		this.date = date;
		this.items = items;
	}

	static create(
		userId: string,
		eventId: string,
		date: Date,
		items: OrderItem[],
	) {
		return new Order(UUID.create().getValue(), userId, eventId, date, items);
	}

	getId(): string {
		return this.id.getValue();
	}

	getUserId(): string {
		return this.userId.getValue();
	}

	getEventId(): string {
		return this.eventId.getValue();
	}

	getItems(): OrderItem[] {
		return [...this.items];
	}

	getDate(): Date {
		return this.date;
	}

	getTotal(): Money {
		let total = 0;

		for (const item of this.items) {
			total += item.price.multiply(item.quantity).getValue();
		}

		return Money.fromNumber(total);
	}
}
