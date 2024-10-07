import { Event } from "@/domain/entity/Event";
import type { EventRepository } from "@/domain/repository/EventRepository";
import type { PrismaClient } from "@prisma/client";
import { ProductMapper } from "../mappers/ProductMapper";

export class PrismaEventRepository implements EventRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async findById(id: string): Promise<Event | null> {
		const eventData = await this.prisma.event.findUnique({
			where: { id },
			include: { products: true },
		});

		if (!eventData) {
			return null;
		}

		const products = eventData.products.map(ProductMapper.toDomain);

		return new Event(
			eventData.id,
			eventData.name,
			eventData.startDate,
			eventData.endDate,
			eventData.location,
			eventData.imageUrl || null,
			products,
		);
	}
	async findAll(): Promise<Event[]> {
		const eventsData = await this.prisma.event.findMany({
			include: { products: true },
		});

		return eventsData.map((e) => {
			const products = e.products.map(ProductMapper.toDomain);

			return new Event(
				e.id,
				e.name,
				e.startDate,
				e.endDate,
				e.location,
				e.imageUrl || null,
				products,
			);
		});
	}
}
