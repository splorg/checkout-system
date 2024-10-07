export interface CheckoutResultDTO {
	success: boolean;
	message: string;
	orderId?: string;
	remainingBalance?: number;
}
