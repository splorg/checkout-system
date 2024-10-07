import type {
	WalletCreatedEvent,
	WalletDebitedEvent,
	WalletDepositedEvent,
	WalletEvent,
} from "@/domain/event/WalletEvent";
import type { DomainEvent, Prisma } from "@prisma/client";

export class WalletEventMapper {
	static toDomain(prismaEvent: DomainEvent): WalletEvent {
		const baseEvent = {
			id: prismaEvent.id,
			aggregateId: prismaEvent.aggregateId,
			version: prismaEvent.version,
			timestamp: prismaEvent.timestamp,
		};

		switch (prismaEvent.type) {
			case "WALLET_CREATED":
				return {
					...baseEvent,
					type: "WALLET_CREATED",
					data: prismaEvent.data as unknown as WalletCreatedEvent["data"],
				};
			case "WALLET_DEPOSITED":
				return {
					...baseEvent,
					type: "WALLET_DEPOSITED",
					data: prismaEvent.data as unknown as WalletDepositedEvent["data"],
				};
			case "WALLET_DEBITED":
				return {
					...baseEvent,
					type: "WALLET_DEBITED",
					data: prismaEvent.data as unknown as WalletDebitedEvent["data"],
				};
			default:
				throw new Error(`Unknown wallet event type: ${prismaEvent.type}`);
		}
	}

	static toPersistence(domainEvent: WalletEvent): DomainEvent {
		return {
			id: domainEvent.id,
			aggregateId: domainEvent.data.walletId,
			aggregateType: "Wallet",
			type: domainEvent.type,
			data: domainEvent.data as unknown as Prisma.JsonObject,
			version: domainEvent.version,
			timestamp: domainEvent.timestamp,
		};
	}
}
