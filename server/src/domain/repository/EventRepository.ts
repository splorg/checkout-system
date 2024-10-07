import type { Event } from "@/domain/entity/Event";

export interface EventRepository {
	findById(id: string): Promise<Event | null>;
	findAll(): Promise<Event[]>;
}
