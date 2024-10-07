import type { EventListDTO } from "@/application/dto/EventList";
import type { Event } from "@/domain/entity/Event";
import type { EventRepository } from "@/domain/repository/EventRepository";

export class GetEvents {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(): Promise<EventListDTO> {
		const events = await this.eventRepository.findAll();

		return this.toDTO(events);
	}

	private toDTO(events: Event[]): EventListDTO {
		return {
			events: events.map((event) => ({
				id: event.getId(),
				name: event.getName(),
				imageUrl: event.getImageUrl(),
				location: event.getLocation(),
				startDate: event.getStartDate(),
				endDate: event.getEndDate(),
			})),
		};
	}
}
