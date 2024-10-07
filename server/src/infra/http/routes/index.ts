import { Router as ExpressRouter } from "express";
import type { CartRouter } from "./CartRouter";
import type { EventsRouter } from "./EventsRouter";
import type { OrderRouter } from "./OrderRouter";
import type { WalletRouter } from "./WalletRouter";

export class Router {
	constructor(
		private readonly eventsRouter: EventsRouter,
		private readonly cartRouter: CartRouter,
		private readonly orderRouter: OrderRouter,
		private readonly walletRouter: WalletRouter,
	) {}

	routes() {
		const router = ExpressRouter();

		router.use("/events", this.eventsRouter.routes());
		router.use("/orders", this.orderRouter.routes());
		router.use("/cart", this.cartRouter.routes());
		router.use("/wallet", this.walletRouter.routes());

		return router;
	}
}
