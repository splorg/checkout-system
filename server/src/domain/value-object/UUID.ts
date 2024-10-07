import * as crypto from "node:crypto";
import { UUID_REGEX } from "../../shared/constants";
import { InvalidValueError } from "../errors";

export class UUID {
	constructor(private readonly value: string) {
		if (!value.match(UUID_REGEX)) {
			throw new InvalidValueError("Invalid UUID");
		}
	}

	static create() {
		const uuid = crypto.randomUUID();
		return new UUID(uuid);
	}

	static isValid(value: string) {
		return value.match(UUID_REGEX);
	}

	getValue() {
		return this.value;
	}
}
