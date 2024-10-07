export abstract class DomainError extends Error {
	statusCode: number;

	constructor(message: string, statusCode = 500) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
	}
}

export class InvalidValueError extends DomainError {}

export class InsufficientStockError extends DomainError {
	constructor(stock: number, quantity: number) {
		super(
			`Insufficient stock. Available: ${stock}, required: ${quantity}`,
			400,
		);
	}
}

export class InsufficientFundsError extends DomainError {
	constructor(balance: number, amount: number) {
		super(
			`Insufficient funds. Available: ${balance}, required: ${amount}`,
			400,
		);
	}
}

export class UnableToRecreateAggregateError extends DomainError {
	constructor(aggregateType: string, message: string) {
		super(`${aggregateType} cannot be recreated: ${message}`);
	}
}

export class UnknownEventError extends DomainError {
	constructor(aggregateType: string) {
		super(`Unknown event for ${aggregateType}`);
	}
}

export class CartItemNotFoundError extends DomainError {
	constructor(productId: string) {
		super(`Cart item not found: ${productId}`, 404);
	}
}

export class CartStatusError extends DomainError {
	constructor(message: string) {
		super(message, 400);
	}
}

export class WalletTransactionError extends DomainError {
	constructor(message: string) {
		super(message, 400);
	}
}

export class ProductNotFoundError extends DomainError {
	constructor(productId: string) {
		super(`Product not found: ${productId}`, 404);
	}
}

export class ProductNotAvailableError extends DomainError {
	constructor(productId: string) {
		super(`Product not available: ${productId}`, 404);
	}
}

export class CartEmptyError extends DomainError {
	constructor() {
		super("Cart is empty", 400);
	}
}

export class CartNotFoundError extends DomainError {
	constructor(cartId: string) {
		super(`Cart not found: ${cartId}`, 404);
	}
}

export class EventNotFoundError extends DomainError {
	constructor(eventId: string) {
		super(`Event not found: ${eventId}`, 404);
	}
}

export class WalletNotFoundError extends DomainError {
	constructor(userId: string) {
		super(`Wallet not found for user: ${userId}`, 404);
	}
}
