import {
	InsufficientFundsError,
	UnknownEventError,
	WalletTransactionError,
} from "../errors";
import {
	type WalletCreatedEvent,
	type WalletDebitedEvent,
	type WalletDepositedEvent,
	type WalletEvent,
	createWalletEvent,
	isWalletCreatedEvent,
	isWalletDebitedEvent,
	isWalletDepositedEvent,
} from "../event/WalletEvent";
import { Money } from "../value-object/Money";
import { UUID } from "../value-object/UUID";

export class Wallet {
	private balance: Money;
	private version = 0;
	private lastUpdatedAt: Date = new Date();

	private constructor(
		private readonly id: UUID,
		private readonly userId: UUID,
		initialBalance: Money,
	) {
		this.balance = initialBalance;
	}

	static create(event: WalletCreatedEvent): Wallet {
		const wallet = new Wallet(
			new UUID(event.id),
			new UUID(event.data.userId),
			Money.fromNumber(event.data.initialBalance),
		);
		wallet.apply(event);

		return wallet;
	}

	static fromEvents(events: WalletEvent[]): Wallet {
		if (events.length === 0) {
			throw new Error("No events to recreate wallet");
		}

		const firstEvent = events[0];

		if (!isWalletCreatedEvent(firstEvent)) {
			throw new Error("Invalid event for wallet creation");
		}

		const wallet = Wallet.create(firstEvent);

		for (const event of events.slice(1)) {
			wallet.apply(event);
		}

		return wallet;
	}

	private apply(event: WalletEvent) {
		if (isWalletCreatedEvent(event)) {
			return this.applyWalletCreated(event);
		}

		if (isWalletDepositedEvent(event)) {
			return this.applyWalletDeposited(event);
		}

		if (isWalletDebitedEvent(event)) {
			return this.applyWalletDebited(event);
		}

		throw new UnknownEventError("WALLET");
	}

	private applyWalletCreated(event: WalletCreatedEvent) {
		this.version = event.version;
		this.lastUpdatedAt = event.timestamp;
		this.balance = Money.fromNumber(event.data.initialBalance);
	}

	private applyWalletDeposited(event: WalletDepositedEvent) {
		this.balance = this.balance.add(Money.fromNumber(event.data.amount));
	}

	private applyWalletDebited(event: WalletDebitedEvent) {
		this.balance = this.balance.subtract(Money.fromNumber(event.data.amount));
	}

	public deposit(amount: Money): WalletDepositedEvent {
		if (amount.getValue() <= 0) {
			throw new Error("Deposit amount must be positive");
		}

		const event = createWalletEvent<WalletDepositedEvent>(
			"WALLET_DEPOSITED",
			{
				userId: this.userId.getValue(),
				amount: amount.getValue(),
			},
			this.version + 1,
		);

		this.apply(event);

		return event;
	}

	public debit(amount: Money): WalletDebitedEvent {
		if (amount.getValue() <= 0) {
			throw new WalletTransactionError("Debit amount must be positive");
		}

		if (this.balance.getValue() < amount.getValue()) {
			throw new InsufficientFundsError(
				this.balance.getValue(),
				amount.getValue(),
			);
		}

		const event = createWalletEvent<WalletDebitedEvent>(
			"WALLET_DEBITED",
			{
				userId: this.userId.getValue(),
				amount: amount.getValue(),
			},
			this.version + 1,
		);

		this.apply(event);

		return event;
	}

	public getBalance(): Money {
		return this.balance;
	}

	public getId(): string {
		return this.id.getValue();
	}

	public getUserId(): string {
		return this.userId.getValue();
	}

	public getVersion(): number {
		return this.version;
	}

	public getLastUpdatedAt(): Date {
		return this.lastUpdatedAt;
	}
}
