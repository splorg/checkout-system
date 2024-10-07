import { InvalidValueError } from "../errors";

export class Money {
	private constructor(private readonly value: number) {}

	static fromNumber(amount: number) {
		if (Number.isNaN(amount)) {
			throw new InvalidValueError("Amount must be a valid number");
		}

		if (amount < 0) {
			throw new InvalidValueError("Invalid amount of money");
		}

		if (!Number.isInteger(amount)) {
			throw new InvalidValueError("Amount must be in cents");
		}

		return new Money(amount);
	}

	getValue() {
		return this.value;
	}

	add(money: Money) {
		return Money.fromNumber(this.value + money.getValue());
	}

	subtract(money: Money) {
		return Money.fromNumber(this.value - money.getValue());
	}

	multiply(amount: number) {
		return Money.fromNumber(this.value * amount);
	}
}
