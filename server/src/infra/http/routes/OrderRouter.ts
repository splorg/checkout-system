import { Router } from "express";
import type { OrderController } from "../controllers/OrderController";

export class OrderRouter {
	constructor(private readonly controller: OrderController) {}

	routes() {
		const router = Router();

		router.get(
			"/:userId",
			this.controller.getOrderHistory.bind(this.controller),
		);

		return router;
	}
}
