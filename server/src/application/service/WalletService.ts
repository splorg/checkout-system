import { Wallet } from "@/domain/aggregate/Wallet";
import {
	type WalletCreatedEvent,
	type WalletEventStore,
	createWalletEvent,
} from "@/domain/event/WalletEvent";
import { Money } from "@/domain/value-object/Money";
import { UUID } from "@/domain/value-object/UUID";

export class WalletService {
	constructor(private readonly eventStore: WalletEventStore) {}

	async getWallet(userId: string): Promise<Wallet | null> {
		const events = await this.eventStore.getWalletEvents(userId);

		if (!events.length) {
			return null;
		}

		return Wallet.fromEvents(events);
	}

	async createWallet(userId: string, initialBalance = 0): Promise<Wallet> {
		const walletId = UUID.create().getValue();
		const event = createWalletEvent<WalletCreatedEvent>(
			"WALLET_CREATED",
			{
				userId,
				initialBalance,
			},
			1,
		);
		await this.eventStore.saveEvents(walletId, [event]);
		return Wallet.create(event);
	}

	async deposit(wallet: Wallet, amount: number): Promise<Wallet> {
		const event = wallet.deposit(Money.fromNumber(amount));
		await this.eventStore.saveEvents(wallet.getId(), [event]);
		return wallet;
	}

	async debit(wallet: Wallet, amount: number): Promise<Wallet> {
		const event = wallet.debit(Money.fromNumber(amount));
		await this.eventStore.saveEvents(wallet.getId(), [event]);
		return wallet;
	}
}
