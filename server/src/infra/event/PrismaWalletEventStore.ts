import type { WalletEvent, WalletEventStore } from "@/domain/event/WalletEvent";
import type { Prisma, PrismaClient } from "@prisma/client";
import { WalletEventMapper } from "../mappers/WalletEventMapper";

export class PrismaWalletEventStore implements WalletEventStore {
	constructor(private readonly prisma: PrismaClient) {}

	async getWalletEvents(userId: string): Promise<WalletEvent[]> {
		const eventsData = await this.prisma.domainEvent.findMany({
			where: {
				aggregateType: "WALLET",
				data: {
					path: "$.userId",
					equals: userId,
				},
			},
			orderBy: {
				version: "asc",
			},
		});

		return eventsData.map(WalletEventMapper.toDomain);
	}

	async saveEvents(aggregateId: string, events: WalletEvent[]): Promise<void> {
		await this.prisma.domainEvent.createMany({
			data: events.map((event) => ({
				id: event.id,
				aggregateId: aggregateId,
				aggregateType: "WALLET",
				type: event.type,
				data: event.data as unknown as Prisma.JsonObject,
				version: event.version,
				timestamp: event.timestamp,
			})),
		});
	}

	async getEvents(aggregateId: string): Promise<WalletEvent[]> {
		const eventsData = await this.prisma.domainEvent.findMany({
			where: {
				aggregateId: aggregateId,
				aggregateType: "WALLET",
			},
			orderBy: {
				version: "asc",
			},
		});

		return eventsData.map(WalletEventMapper.toDomain);
	}
}
