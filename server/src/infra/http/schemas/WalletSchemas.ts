import { z } from "zod";

export const DepositFundsSchema = z.object({
	amount: z.number().positive(),
});
