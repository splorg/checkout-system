import type { AddProductToCart } from "@/application/use-case/AddProductToCart";
import type { CompleteCheckout } from "@/application/use-case/CompleteCheckout";
import type { CreateCart } from "@/application/use-case/CreateCart";
import type { GetCurrentCart } from "@/application/use-case/GetCurrentCart";
import type { RemoveProductFromCart } from "@/application/use-case/RemoveProductFromCart";
import { UUID } from "@/domain/value-object/UUID";
import type { Request, Response } from "express";
import {
	AddProductToCartSchema,
	CompleteCheckoutSchema,
	CreateCartSchema,
} from "../schemas/CartSchemas";

export class CartController {
	constructor(
		private readonly create: CreateCart,
		private readonly addProduct: AddProductToCart,
		private readonly removeProduct: RemoveProductFromCart,
		private readonly getCurrent: GetCurrentCart,
		private readonly checkout: CompleteCheckout,
	) {}

	async createCart(req: Request, res: Response): Promise<void> {
		const parsedBody = CreateCartSchema.parse(req.body);
		const { userId, eventId, productId, quantity } = parsedBody;
		const result = await this.create.execute(
			userId,
			eventId,
			productId,
			quantity,
		);

		res.json(result);
	}

	async addProductToCart(req: Request, res: Response): Promise<void> {
		const parsedBody = AddProductToCartSchema.parse(req.body);
		const { cartId, productId, quantity } = parsedBody;
		const result = await this.addProduct.execute(cartId, productId, quantity);

		res.json(result);
	}

	async removeProductFromCart(req: Request, res: Response): Promise<void> {
		const { cartId, productId } = req.params;

		if (!productId || !UUID.isValid(productId)) {
			res.status(400).json({ error: "Invalid product ID" });
			return;
		}

		if (!cartId || !UUID.isValid(cartId)) {
			res.status(400).json({ error: "Invalid cart ID" });
			return;
		}
		const result = await this.removeProduct.execute(cartId, productId);

		res.json(result);
	}

	async getCurrentCart(req: Request, res: Response): Promise<void> {
		const { userId, eventId } = req.params;

		if (!userId || !UUID.isValid(userId)) {
			res.status(400).json({ error: "Invalid user ID" });
			return;
		}

		if (!eventId || !UUID.isValid(eventId)) {
			res.status(400).json({ error: "Invalid event ID" });
			return;
		}

		const result = await this.getCurrent.execute(userId, eventId);

		res.json(result);
	}

	async completeCheckout(req: Request, res: Response): Promise<void> {
		const parsedBody = CompleteCheckoutSchema.parse(req.body);
		const { cartId } = parsedBody;
		const result = await this.checkout.execute(cartId);

		res.json(result);
	}
}
