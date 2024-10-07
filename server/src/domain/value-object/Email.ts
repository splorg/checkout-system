import { InvalidValueError } from "../errors";

export class Email {
	private readonly value: string;

	private constructor(value: string) {
		if (!value.match(/^(.+)@(.+)$/)) {
			throw new InvalidValueError("Invalid email");
		}

		this.value = value;
	}

	static fromString(str: string) {
		return new Email(str);
	}

	getValue() {
		return this.value;
	}
}
