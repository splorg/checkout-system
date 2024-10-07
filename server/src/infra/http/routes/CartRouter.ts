import { Router } from "express";
import type { CartController } from "../controllers/CartController";

export class CartRouter {
	constructor(private readonly controller: CartController) {}

	routes() {
		const router = Router();

		router.post("/create", this.controller.createCart.bind(this.controller));
		router.post("/add", this.controller.addProductToCart.bind(this.controller));
		router.get(
			"/:userId/:eventId",
			this.controller.getCurrentCart.bind(this.controller),
		);
		router.post(
			"/checkout",
			this.controller.completeCheckout.bind(this.controller),
		);
		router.delete(
			"/:cartId/:productId",
			this.controller.removeProductFromCart.bind(this.controller),
		);

		return router;
	}
}
