export type EventListDTO = {
	events: {
		id: string;
		name: string;
		imageUrl: string | null;
		location: string;
		startDate: Date;
		endDate: Date;
	}[];
};
