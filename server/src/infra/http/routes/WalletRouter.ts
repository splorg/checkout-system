import { Router } from "express";
import type { WalletController } from "../controllers/WalletController";

export class WalletRouter {
	constructor(private readonly controller: WalletController) {}

	routes() {
		const router = Router();

		router.get(
			"/:userId",
			this.controller.getCurrentWallet.bind(this.controller),
		);
		router.post("/:userId", this.controller.depositFunds.bind(this.controller));

		return router;
	}
}
