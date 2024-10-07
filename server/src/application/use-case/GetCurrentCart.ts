import type { ProductRepository } from "@/domain/repository/ProductRepository";
import { type CartResultDTO, CartResultMapper } from "../dto/CartResult";
import type { CartService } from "../service/CartService";

export class GetCurrentCart {
	constructor(
		private readonly cartService: CartService,
		private readonly productRepository: ProductRepository,
	) {}

	async execute(
		userId: string,
		eventId: string,
	): Promise<CartResultDTO | { cart: null }> {
		const cart = await this.cartService.getCurrentCart(userId, eventId);

		if (!cart) {
			return { cart: null };
		}

		const allProductsInCart = await this.productRepository.getCartItems(
			cart.getItems().map((item) => item.getProductId()),
		);

		return CartResultMapper.toDTO(cart, allProductsInCart);
	}
}
