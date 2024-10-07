import { z } from "zod";

export const CreateCartSchema = z.object({
	userId: z.string().uuid(),
	eventId: z.string().uuid(),
	productId: z.string().uuid(),
	quantity: z.number().positive(),
});

export const AddProductToCartSchema = z.object({
	cartId: z.string().uuid(),
	productId: z.string().uuid(),
	quantity: z.number().positive(),
});

export const CompleteCheckoutSchema = z.object({
	cartId: z.string().uuid(),
});
