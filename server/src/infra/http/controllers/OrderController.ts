import type { GetOrderHistory } from "@/application/use-case/GetOrderHistory";
import type { Request, Response } from "express";

export class OrderController {
	constructor(private readonly history: GetOrderHistory) {}

	async getOrderHistory(req: Request, res: Response): Promise<void> {
		const { userId } = req.params;

		const result = await this.history.execute(userId);

		res.json(result);
	}
}
