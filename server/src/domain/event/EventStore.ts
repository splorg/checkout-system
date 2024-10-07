import type { BaseEvent } from "./BaseEvent";

export interface EventStore<T extends BaseEvent> {
	saveEvents(aggregateId: string, events: T[]): Promise<void>;
	getEvents(aggregateId: string): Promise<T[]>;
}
