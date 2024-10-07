import type { Money } from "./Money";
import type { UUID } from "./UUID";

export class CartItem {
	constructor(
		private productId: UUID,
		private productName: string,
		private quantity: number,
		private price: Money,
	) {}

	getTotal(): Money {
		return this.price.multiply(this.quantity);
	}

	increaseQuantity(amount: number): void {
		this.quantity += amount;
	}

	decreaseQuantity(amount: number): void {
		this.quantity = Math.max(0, this.quantity - amount);
	}

	getProductId(): string {
		return this.productId.getValue();
	}

	getProductName(): string {
		return this.productName;
	}

	getQuantity(): number {
		return this.quantity;
	}

	getPrice(): Money {
		return this.price;
	}
}
