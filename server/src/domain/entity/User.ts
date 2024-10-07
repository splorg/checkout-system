import * as crypto from "node:crypto";
import { Email } from "@/domain/value-object/Email";
import { UUID } from "@/domain/value-object/UUID";

export class User {
	private readonly id: UUID;
	private readonly name: string;
	private readonly email: Email;
	private readonly password: string;

	constructor(id: string, name: string, email: string, password: string) {
		this.id = new UUID(id);
		this.name = name;
		this.email = Email.fromString(email);
		this.password = password;
	}

	static create(name: string, email: string, password: string) {
		const uuid = UUID.create();
		const hashedPassword = User.hashPassword(password);

		return new User(uuid.getValue(), name, email, hashedPassword);
	}

	static hashPassword(plainTextPassword: string) {
		const salt = crypto.randomBytes(16).toString("hex");
		const iterations = 100;
		const keyLength = 64;
		const digest = "sha512";
		const hashedPassword = crypto.pbkdf2Sync(
			plainTextPassword,
			salt,
			iterations,
			keyLength,
			digest,
		);

		return `${salt}:${hashedPassword}:${iterations}:${keyLength}:${digest}`;
	}

	verifyPassword(password: string, hashedPassword: string) {
		const [salt, hash, iterations, keyLength, digest] =
			hashedPassword.split(":");
		const hashToVerify = crypto
			.pbkdf2Sync(
				password,
				salt,
				Number.parseInt(iterations),
				Number.parseInt(keyLength),
				digest,
			)
			.toString("hex");

		return hashToVerify === hash;
	}

	getId() {
		return this.id.getValue();
	}

	getName() {
		return this.name;
	}

	getEmail() {
		return this.email.getValue();
	}
}
