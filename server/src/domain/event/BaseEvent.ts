export interface BaseEvent<TEventData = unknown> {
	type: string;
	data: TEventData;
	version: number;
	timestamp: Date;
	id: string;
}
