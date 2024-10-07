import type { EventsController } from "@/infra/http/controllers/EventsController";
import { Router } from "express";

export class EventsRouter {
	constructor(private readonly controller: EventsController) {}

	routes() {
		const router = Router();

		router.get("/", this.controller.getEvents.bind(this.controller));
		router.get(
			"/:eventId/products",
			this.controller.getEventProducts.bind(this.controller),
		);

		return router;
	}
}
