import type { GetEventProductList } from "@/application/use-case/GetEventProductList";
import type { GetEvents } from "@/application/use-case/GetEvents";
import { UUID } from "@/domain/value-object/UUID";
import type { Request, Response } from "express";

export class EventsController {
	constructor(
		private readonly getEventProductList: GetEventProductList,
		private readonly getEventList: GetEvents,
	) {}

	async getEventProducts(req: Request, res: Response): Promise<void> {
		const { eventId } = req.params;

		if (!eventId || !UUID.isValid(eventId)) {
			res.status(400).json({ error: "Invalid event ID" });
			return;
		}

		const result = await this.getEventProductList.execute(eventId);

		res.json(result);
	}

	async getEvents(req: Request, res: Response): Promise<void> {
		const result = await this.getEventList.execute();

		res.json(result);
	}
}
