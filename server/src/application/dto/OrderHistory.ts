export interface OrderHistoryDTO {
	orders: {
		orderId: string;
		total: number;
		date: Date;
		items: {
			productId: string;
			productName: string;
			quantity: number;
			price: number;
		}[];
	}[];
}
