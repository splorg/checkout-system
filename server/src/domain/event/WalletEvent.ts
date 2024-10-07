import { UUID } from "../value-object/UUID";
import type { BaseEvent } from "./BaseEvent";
import type { EventStore } from "./EventStore";

interface WalletEventBase {
	userId: string;
}

export interface WalletCreatedEvent
	extends BaseEvent<
		WalletEventBase & {
			initialBalance: number;
		}
	> {
	type: "WALLET_CREATED";
}

export interface WalletDepositedEvent
	extends BaseEvent<
		WalletEventBase & {
			amount: number;
		}
	> {
	type: "WALLET_DEPOSITED";
}

export interface WalletDebitedEvent
	extends BaseEvent<
		WalletEventBase & {
			amount: number;
		}
	> {
	type: "WALLET_DEBITED";
}

export type WalletEvent =
	| WalletCreatedEvent
	| WalletDepositedEvent
	| WalletDebitedEvent;

export interface WalletEventStore extends EventStore<WalletEvent> {
	getWalletEvents(userId: string): Promise<WalletEvent[]>;
}

export function createWalletEvent<T extends WalletEvent>(
	type: T["type"],
	data: T["data"],
	version: number,
	id: string = UUID.create().getValue(),
	timestamp: Date = new Date(),
): T {
	return { type, data, version, timestamp, id } as T;
}

export function isWalletCreatedEvent(
	event: WalletEvent,
): event is WalletCreatedEvent {
	return event.type === "WALLET_CREATED";
}

export function isWalletDepositedEvent(
	event: WalletEvent,
): event is WalletDepositedEvent {
	return event.type === "WALLET_DEPOSITED";
}

export function isWalletDebitedEvent(
	event: WalletEvent,
): event is WalletDebitedEvent {
	return event.type === "WALLET_DEBITED";
}
