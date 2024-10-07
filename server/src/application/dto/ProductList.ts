export type ProductListDTO = {
	products: {
		id: string;
		eventId: string;
		name: string;
		price: number;
		imageUrl: string | null;
	}[];
};
